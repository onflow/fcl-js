const path = require("path")
const fs = require("fs")
const {Node} = require("ts-morph")
const {parseJsDoc} = require("./jsdoc-parser")
const {
  cleanupTypeText,
  toCamelCase,
  escapeParameterNameForMDX,
  escapeTextForMDX,
} = require("./type-utils")

function extractFunctionInfo(
  declaration,
  functionName,
  sourceFile,
  namespace = null
) {
  try {
    let funcInfo = null

    // Handle function declarations
    if (Node.isFunctionDeclaration(declaration)) {
      const jsDocInfo = parseJsDoc(declaration)
      const parameters = declaration.getParameters().map(param => {
        let paramName = param.getName()
        const paramType = cleanupTypeText(param.getType().getText())
        const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

        // Handle destructured parameters by using camelCase of the type name
        if (paramName.includes("{") && paramName.includes("}")) {
          // Extract the type name from the parameter type
          // Handle both direct types (AccountProofData) and import types (import("...").AccountProofData)
          const typeText = param.getType().getText()
          let typeMatch = typeText.match(/^([A-Z][a-zA-Z0-9]*)/) // Direct type
          if (!typeMatch) {
            typeMatch = typeText.match(/import\([^)]+\)\.([A-Z][a-zA-Z0-9]*)/) // Import type
          }

          if (typeMatch && typeMatch[1]) {
            paramName = toCamelCase(typeMatch[1])
          } else {
            // Fallback to "options" if we can't extract a type name
            paramName = "options"
          }
        }

        // Handle nested JSDoc parameters (e.g., queryOptions.height)
        let nestedParams = []
        if (jsDocInfo.params) {
          Object.keys(jsDocInfo.params).forEach(jsDocParamName => {
            if (jsDocParamName.startsWith(paramName + ".")) {
              const nestedParamName = jsDocParamName.substring(
                paramName.length + 1
              )

              // Try to extract type information from the parameter's TypeScript type
              let nestedParamType = "any"
              try {
                const paramTypeSymbol = param.getType().getSymbol()
                if (paramTypeSymbol) {
                  const typeDeclaration = paramTypeSymbol.getDeclarations()?.[0]
                  if (
                    typeDeclaration &&
                    Node.isInterfaceDeclaration(typeDeclaration)
                  ) {
                    // Find the property in the interface
                    const property =
                      typeDeclaration.getProperty(nestedParamName)
                    if (property) {
                      const propertyType = property.getType()
                      nestedParamType = cleanupTypeText(propertyType.getText())
                    }
                  }
                }
              } catch (e) {
                // Fallback to any if type extraction fails
                nestedParamType = "any"
              }

              nestedParams.push({
                name: escapeParameterNameForMDX(nestedParamName),
                type: nestedParamType,
                required: true, // Default to required
                description:
                  escapeTextForMDX(jsDocInfo.params[jsDocParamName]) || "",
              })
            }
          })
        }

        return {
          name: escapeParameterNameForMDX(paramName),
          type: paramType,
          required: !param.isOptional(),
          description: escapeTextForMDX(paramJsDoc) || "",
          nestedParams: nestedParams.length > 0 ? nestedParams : undefined,
        }
      })

      // Get the actual return type, not the function signature
      let returnType = "any"
      try {
        const funcReturnType = declaration.getReturnType()
        const returnTypeText = funcReturnType.getText()

        // If the return type text looks like a function signature, extract just the return part
        // But don't apply this logic to object literal types (which start with '{')
        if (returnTypeText.includes("=>") && !returnTypeText.trim().startsWith("{")) {
          const returnPart = returnTypeText.split("=>").pop()?.trim()
          if (returnPart) {
            returnType = cleanupTypeText(returnPart)
          } else {
            returnType = cleanupTypeText(returnTypeText)
          }
        } else {
          returnType = cleanupTypeText(returnTypeText)
        }
      } catch (e) {
        console.warn(`Error extracting return type: ${e.message}`)
        returnType = "any"
      }

      // Extract return description from JSDoc
      let returnDescription = null
      if (jsDocInfo.returns) {
        returnDescription = escapeTextForMDX(jsDocInfo.returns)
      }

      const filePath = sourceFile.getFilePath()
      const relativeFilePath = path.relative(process.cwd(), filePath)

      funcInfo = {
        name: functionName,
        returnType,
        returnDescription,
        parameters,
        description: jsDocInfo.description || "",
        customExample: jsDocInfo.example || "",
        sourceFilePath: relativeFilePath,
      }
    }
    // Handle variable declarations with function values
    else if (Node.isVariableDeclaration(declaration)) {
      let jsDocInfo = parseJsDoc(declaration)

      // If no JSDoc found on the declaration, try the parent VariableStatement
      if (!jsDocInfo.description) {
        const parentList = declaration.getParent()
        if (parentList) {
          const parentStatement = parentList.getParent()
          if (parentStatement) {
            jsDocInfo = parseJsDoc(parentStatement)
          }
        }
      }

      const initializer = declaration.getInitializer()

      // Check for function calls that might wrap a function (like withGlobalContext(createAccount))
      if (initializer && Node.isCallExpression(initializer)) {
        const args = initializer.getArguments()
        // Check if the call expression itself is calling a function we can analyze
        const callExpression = initializer.getExpression()
        if (Node.isIdentifier(callExpression)) {
          const functionName_inner = callExpression.getText()

          // Look for the function being called (like createQuery)
          const calledFunction = sourceFile.getFunction(functionName_inner)
          if (calledFunction) {
            // Look for inner function declarations within the called function
            const innerFunctions = calledFunction.getFunctions()
            if (innerFunctions.length > 0) {
              // Get the first inner function (usually the one being returned)
              const innerFunction = innerFunctions[0]
              const innerFuncInfo = extractFunctionInfo(
                innerFunction,
                functionName,
                sourceFile,
                namespace
              )
              if (innerFuncInfo) {
                // Merge JSDoc from the exported variable
                return {
                  ...innerFuncInfo,
                  description:
                    jsDocInfo.description || innerFuncInfo.description,
                  customExample:
                    jsDocInfo.example || innerFuncInfo.customExample,
                }
              }
            }

            // Also look for inner variable declarations that might contain arrow functions
            const innerVariables = calledFunction.getVariableDeclarations()
            if (innerVariables.length > 0) {
              // Look for a variable with the same name as the function we're looking for
              const matchingVariable = innerVariables.find(
                v => v.getName() === functionName
              )
              if (matchingVariable) {
                const innerFuncInfo = extractFunctionInfo(
                  matchingVariable,
                  functionName,
                  sourceFile,
                  namespace
                )
                if (innerFuncInfo) {
                  // Merge JSDoc from the exported variable
                  return {
                    ...innerFuncInfo,
                    description:
                      jsDocInfo.description || innerFuncInfo.description,
                    customExample:
                      jsDocInfo.example || innerFuncInfo.customExample,
                  }
                }
              }
            }
          }
        }

        if (args.length > 0) {
          const firstArg = args[0]
          // If the first argument is an identifier, try to resolve it to a function
          if (Node.isIdentifier(firstArg)) {
            const argName = firstArg.getText()
            // Look for the function with this name in the source file
            const referencedFunction = sourceFile.getFunction(argName)
            if (referencedFunction) {
              // Look for inner function declarations within the referenced function
              const innerFunctions = referencedFunction.getFunctions()
              if (innerFunctions.length > 0) {
                // Get the first inner function (usually the one being returned)
                const innerFunction = innerFunctions[0]
                const innerFuncInfo = extractFunctionInfo(
                  innerFunction,
                  functionName,
                  sourceFile,
                  namespace
                )
                if (innerFuncInfo) {
                  // Merge JSDoc from the exported variable, including nested parameters
                  const mergedParameters = innerFuncInfo.parameters.map(
                    param => {
                      // Check if there are nested JSDoc parameters for this parameter
                      let nestedParams = []
                      if (jsDocInfo.params) {
                        Object.keys(jsDocInfo.params).forEach(
                          jsDocParamName => {
                            if (jsDocParamName.startsWith(param.name + ".")) {
                              const nestedParamName = jsDocParamName.substring(
                                param.name.length + 1
                              )
                              // Extract nested parameter type from the parameter's TypeScript interface
                              let nestedParamType = "any"
                              try {
                                // Get the parameter from the inner function for type extraction
                                const innerParams =
                                  innerFunction.getParameters()
                                const matchingParam = innerParams.find(p => {
                                  let pName = p.getName()
                                  if (
                                    pName.includes("{") &&
                                    pName.includes("}")
                                  ) {
                                    const typeText = p.getType().getText()
                                    let typeMatch =
                                      typeText.match(/^([A-Z][a-zA-Z0-9]*)/)
                                    if (!typeMatch) {
                                      typeMatch = typeText.match(
                                        /import\([^)]+\)\.([A-Z][a-zA-Z0-9]*)/
                                      )
                                    }
                                    if (typeMatch && typeMatch[1]) {
                                      pName = toCamelCase(typeMatch[1])
                                    }
                                  }
                                  return pName === param.name
                                })

                                if (matchingParam) {
                                  const paramTypeSymbol = matchingParam
                                    .getType()
                                    .getSymbol()
                                  if (paramTypeSymbol) {
                                    const typeDeclaration =
                                      paramTypeSymbol.getDeclarations()?.[0]
                                    if (
                                      typeDeclaration &&
                                      Node.isInterfaceDeclaration(
                                        typeDeclaration
                                      )
                                    ) {
                                      const property =
                                        typeDeclaration.getProperty(
                                          nestedParamName
                                        )
                                      if (property) {
                                        const propertyType = property.getType()
                                        nestedParamType = cleanupTypeText(
                                          propertyType.getText()
                                        )
                                      }
                                    }
                                  }
                                }
                              } catch (e) {
                                // Fallback to any
                                nestedParamType = "any"
                              }

                              nestedParams.push({
                                name: escapeParameterNameForMDX(
                                  nestedParamName
                                ),
                                type: nestedParamType,
                                required: true, // Default to required
                                description:
                                  escapeTextForMDX(
                                    jsDocInfo.params[jsDocParamName]
                                  ) || "",
                              })
                            }
                          }
                        )
                      }

                      return {
                        ...param,
                        // Override description from JSDoc if available
                        description:
                          jsDocInfo.params && jsDocInfo.params[param.name]
                            ? escapeTextForMDX(jsDocInfo.params[param.name])
                            : param.description,
                        nestedParams:
                          nestedParams.length > 0 ? nestedParams : undefined,
                      }
                    }
                  )

                  return {
                    ...innerFuncInfo,
                    description:
                      jsDocInfo.description || innerFuncInfo.description,
                    customExample:
                      jsDocInfo.example || innerFuncInfo.customExample,
                    parameters: mergedParameters,
                  }
                }
              }

              // Fallback: try to extract info directly from the referenced function
              const referencedFuncInfo = extractFunctionInfo(
                referencedFunction,
                functionName,
                sourceFile,
                namespace
              )
              if (referencedFuncInfo) {
                // Override with JSDoc from the exported variable
                return {
                  ...referencedFuncInfo,
                  description:
                    jsDocInfo.description || referencedFuncInfo.description,
                  customExample:
                    jsDocInfo.example || referencedFuncInfo.customExample,
                }
              }
            }
          }
        }
      }

      if (
        initializer &&
        (Node.isFunctionExpression(initializer) ||
          Node.isArrowFunction(initializer))
      ) {
        const parameters = initializer.getParameters().map(param => {
          let paramName = param.getName()
          const paramType = cleanupTypeText(param.getType().getText())
          const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

          // Handle destructured parameters by using camelCase of the type name
          if (paramName.includes("{") && paramName.includes("}")) {
            // Extract the type name from the parameter type
            // Handle both direct types (AccountProofData) and import types (import("...").AccountProofData)
            const typeText = param.getType().getText()
            let typeMatch = typeText.match(/^([A-Z][a-zA-Z0-9]*)/) // Direct type
            if (!typeMatch) {
              typeMatch = typeText.match(/import\([^)]+\)\.([A-Z][a-zA-Z0-9]*)/) // Import type
            }

            if (typeMatch && typeMatch[1]) {
              paramName = toCamelCase(typeMatch[1])
            } else {
              // Fallback to "options" if we can't extract a type name
              paramName = "options"
            }
          }

          // Handle nested JSDoc parameters (e.g., queryOptions.height)
          let nestedParams = []
          if (jsDocInfo.params) {
            Object.keys(jsDocInfo.params).forEach(jsDocParamName => {
              if (jsDocParamName.startsWith(paramName + ".")) {
                const nestedParamName = jsDocParamName.substring(
                  paramName.length + 1
                )

                // Try to extract type information from the parameter's TypeScript type
                let nestedParamType = "any"
                try {
                  const paramTypeSymbol = param.getType().getSymbol()
                  if (paramTypeSymbol) {
                    const typeDeclaration =
                      paramTypeSymbol.getDeclarations()?.[0]
                    if (
                      typeDeclaration &&
                      Node.isInterfaceDeclaration(typeDeclaration)
                    ) {
                      // Find the property in the interface
                      const property =
                        typeDeclaration.getProperty(nestedParamName)
                      if (property) {
                        const propertyType = property.getType()
                        nestedParamType = cleanupTypeText(
                          propertyType.getText()
                        )
                      }
                    }
                  }
                } catch (e) {
                  // Fallback to any if type extraction fails
                  nestedParamType = "any"
                }

                nestedParams.push({
                  name: escapeParameterNameForMDX(nestedParamName),
                  type: nestedParamType,
                  required: true, // Default to required
                  description:
                    escapeTextForMDX(jsDocInfo.params[jsDocParamName]) || "",
                })
              }
            })
          }

          return {
            name: escapeParameterNameForMDX(paramName),
            type: paramType,
            required: !param.isOptional(),
            description: escapeTextForMDX(paramJsDoc) || "",
            nestedParams: nestedParams.length > 0 ? nestedParams : undefined,
          }
        })

        // Get the actual return type, not the function signature
        let returnType = "any"
        try {
          const funcReturnType = initializer.getReturnType()
          const returnTypeText = funcReturnType.getText()

          // If the return type text looks like a function signature, extract just the return part
          if (returnTypeText.includes("=>")) {
            const returnPart = returnTypeText.split("=>").pop()?.trim()
            if (returnPart) {
              returnType = cleanupTypeText(returnPart)
            } else {
              returnType = cleanupTypeText(returnTypeText)
            }
          } else {
            returnType = cleanupTypeText(returnTypeText)
          }
        } catch (e) {
          console.warn(`Error extracting return type: ${e.message}`)
          returnType = "any"
        }

        // Extract return description from JSDoc
        let returnDescription = null
        if (jsDocInfo.returns) {
          returnDescription = escapeTextForMDX(jsDocInfo.returns)
        }

        const filePath = sourceFile.getFilePath()
        const relativeFilePath = path.relative(process.cwd(), filePath)

        funcInfo = {
          name: functionName,
          returnType,
          returnDescription,
          parameters,
          description: jsDocInfo.description || "",
          customExample: jsDocInfo.example || "",
          sourceFilePath: relativeFilePath,
        }
      }
      // Handle variable declarations with JSDoc that represent functions
      // (like resolve = pipe([...]) or other function-returning expressions)
      else if (jsDocInfo.description || jsDocInfo.params || jsDocInfo.returns) {
        // Extract parameter information from JSDoc if available
        const parameters = []
        if (jsDocInfo.params) {
          // First, get all top-level parameters (those without dots)
          const topLevelParams = Object.keys(jsDocInfo.params).filter(
            paramName => !paramName.includes(".")
          )

          topLevelParams.forEach(paramName => {
            const paramDesc = jsDocInfo.params[paramName]

            // Handle nested JSDoc parameters (e.g., queryOptions.height)
            let nestedParams = []
            Object.keys(jsDocInfo.params).forEach(jsDocParamName => {
              if (jsDocParamName.startsWith(paramName + ".")) {
                const nestedParamName = jsDocParamName.substring(
                  paramName.length + 1
                )

                // For JSDoc-only cases, try to infer type from variable declaration
                let nestedParamType = "any"
                try {
                  const variableType = declaration.getType()
                  const typeSymbol = variableType.getSymbol()
                  if (typeSymbol) {
                    const typeDeclaration = typeSymbol.getDeclarations()?.[0]
                    if (
                      typeDeclaration &&
                      Node.isInterfaceDeclaration(typeDeclaration)
                    ) {
                      const property =
                        typeDeclaration.getProperty(nestedParamName)
                      if (property) {
                        const propertyType = property.getType()
                        nestedParamType = cleanupTypeText(
                          propertyType.getText()
                        )
                      }
                    }
                  }
                } catch (e) {
                  // Fallback to any
                  nestedParamType = "any"
                }

                nestedParams.push({
                  name: escapeParameterNameForMDX(nestedParamName),
                  type: nestedParamType,
                  required: true, // Default to required
                  description:
                    escapeTextForMDX(jsDocInfo.params[jsDocParamName]) || "",
                })
              }
            })

            parameters.push({
              name: escapeParameterNameForMDX(paramName),
              type: "any", // Default type since we can't infer from call expressions
              required: true, // Default to required
              description: escapeTextForMDX(paramDesc) || "",
              nestedParams: nestedParams.length > 0 ? nestedParams : undefined,
            })
          })
        }

        // Get return type from JSDoc or try to infer from the variable type
        let returnType = "any"
        let returnDescription = null
        if (jsDocInfo.returns) {
          returnDescription = escapeTextForMDX(jsDocInfo.returns)
        }

        // Always try to get the actual TypeScript return type
        try {
          returnType = cleanupTypeText(declaration.getType().getText())
        } catch (e) {
          // Fallback to any if type inference fails
          returnType = "any"
        }

        const filePath = sourceFile.getFilePath()
        const relativeFilePath = path.relative(process.cwd(), filePath)

        funcInfo = {
          name: functionName,
          returnType,
          returnDescription,
          parameters,
          description: jsDocInfo.description || "",
          customExample: jsDocInfo.example || "",
          sourceFilePath: relativeFilePath,
        }
      }
    }

    // Add namespace if provided
    if (funcInfo && namespace) {
      funcInfo.namespace = namespace
    }

    return funcInfo
  } catch (e) {
    console.warn(
      `Error extracting function info for ${functionName}: ${e.message}`
    )
    return null
  }
}

function findFunctionInSourceFile(sourceFile, functionName) {
  try {
    // First, check if this function is re-exported from another module
    // If it is, we should NOT try to extract it directly here, but let the re-export resolution handle it
    const exportDeclarations = sourceFile.getExportDeclarations()
    for (const exportDecl of exportDeclarations) {
      const namedExports = exportDecl.getNamedExports()
      const hasExport = namedExports.some(
        namedExport => namedExport.getName() === functionName
      )

      if (hasExport && exportDecl.getModuleSpecifier()) {
        return null // This will force the caller to use re-export resolution
      }
    }

    const exportedDeclarations = sourceFile.getExportedDeclarations()
    if (exportedDeclarations.has(functionName)) {
      const declarations = exportedDeclarations.get(functionName)

      for (const declaration of declarations) {
        // Skip export declarations - we want actual function implementations
        if (Node.isExportDeclaration(declaration)) {
          continue
        }

        const funcInfo = extractFunctionInfo(
          declaration,
          functionName,
          sourceFile
        )
        if (funcInfo) {
          return funcInfo
        }
      }
    }

    return null
  } catch (e) {
    console.warn(
      `Error finding function ${functionName} in source file: ${e.message}`
    )
    return null
  }
}

function resolveOnFlowPackage(packageName) {
  try {
    // Look for the package in the workspace packages directory
    // We need to account for the fact that the current working directory is already in packages/
    const packagesDir = path.resolve(process.cwd(), "..")
    const packageDir = path.join(packagesDir, packageName)
    const packageJsonPath = path.join(packageDir, "package.json")

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
      const entryFile = packageJson.source || packageJson.main || "src/index.ts"
      const entryFilePath = path.resolve(packageDir, entryFile)

      if (fs.existsSync(entryFilePath)) {
        return entryFilePath
      }
    }

    return null
  } catch (e) {
    console.warn(`Error resolving @onflow/${packageName}: ${e.message}`)
    return null
  }
}

function resolveReExportedFunction(sourceFile, exportName, moduleSpecifier) {
  try {
    let referencedSourceFile = null

    // Handle @onflow/ package specifiers
    if (moduleSpecifier.startsWith("@onflow/")) {
      const packageName = moduleSpecifier.replace("@onflow/", "")
      const packageEntryPath = resolveOnFlowPackage(packageName)

      if (packageEntryPath) {
        // Get the ts-morph project from the source file
        const project = sourceFile.getProject()

        // Try to get the source file, or add it if not already added
        referencedSourceFile = project.getSourceFile(packageEntryPath)
        if (!referencedSourceFile) {
          try {
            referencedSourceFile = project.addSourceFileAtPath(packageEntryPath)
          } catch (e) {
            console.warn(
              `Could not add source file at ${packageEntryPath}: ${e.message}`
            )
          }
        }
      }
    } else {
      // Handle relative imports - existing logic
      const referencedSourceFiles = sourceFile.getReferencedSourceFiles()

      // Find the source file that matches the module specifier
      // Try exact matches first, then partial matches
      const candidates = []

      for (const sf of referencedSourceFiles) {
        const fileName = path.basename(sf.getFilePath(), ".ts")
        const moduleFileName = path.basename(moduleSpecifier, ".ts")

        // Exact match (highest priority)
        if (fileName === moduleFileName) {
          candidates.push({sf, priority: 1})
        }
        // Path includes the module specifier
        else if (
          sf.getFilePath().includes(moduleSpecifier) ||
          sf.getFilePath().includes(moduleSpecifier.replace("./", ""))
        ) {
          candidates.push({sf, priority: 2})
        }
      }

      // Sort by priority and take the first (exact matches first)
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.priority - b.priority)
        referencedSourceFile = candidates[0].sf
      }
    }

    if (referencedSourceFile) {
      const funcInfo = findFunctionInSourceFile(
        referencedSourceFile,
        exportName
      )
      if (funcInfo) {
        return funcInfo
      }

      // If not found in the entry file, check if it's re-exported from elsewhere
      // Look through export declarations to find where this function comes from
      const exportDeclarations = referencedSourceFile.getExportDeclarations()
      for (const exportDecl of exportDeclarations) {
        const namedExports = exportDecl.getNamedExports()

        // Check if this export contains our function (including checking both name and alias)
        const hasExport = namedExports.some(namedExport => {
          const name = namedExport.getName()
          const alias = namedExport.getAliasNode()?.getText()
          const finalName = alias || name
          return finalName === exportName || name === exportName
        })

        if (hasExport) {
          const moduleSpec = exportDecl.getModuleSpecifier()
          if (moduleSpec) {
            const moduleSpecValue = moduleSpec.getLiteralValue()

            // Find the original name to look up in the target module
            const matchingExport = namedExports.find(namedExport => {
              const name = namedExport.getName()
              const alias = namedExport.getAliasNode()?.getText()
              const finalName = alias || name
              return finalName === exportName || name === exportName
            })

            const originalNameToLookup = matchingExport?.getName() || exportName

            // Recursively resolve from the module this export comes from
            return resolveReExportedFunction(
              referencedSourceFile,
              originalNameToLookup,
              moduleSpecValue
            )
          }
        }
      }
    }

    return null
  } catch (e) {
    console.warn(
      `Error resolving re-exported function ${exportName} from ${moduleSpecifier}: ${e.message}`
    )
    return null
  }
}

module.exports = {
  extractFunctionInfo,
  findFunctionInSourceFile,
  resolveReExportedFunction,
}
