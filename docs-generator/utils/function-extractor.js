const path = require("path")
const fs = require("fs")
const {Node} = require("ts-morph")
const {parseJsDoc} = require("./jsdoc-parser")
const {
  cleanupTypeText,
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
        const paramName = param.getName()
        const paramType = cleanupTypeText(param.getType().getText())
        const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

        return {
          name: escapeParameterNameForMDX(paramName),
          type: paramType,
          required: !param.isOptional(),
          description: escapeTextForMDX(paramJsDoc) || "",
        }
      })

      const returnType = cleanupTypeText(declaration.getReturnType().getText())

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

      if (
        initializer &&
        (Node.isFunctionExpression(initializer) ||
          Node.isArrowFunction(initializer))
      ) {
        const parameters = initializer.getParameters().map(param => {
          const paramName = param.getName()
          const paramType = cleanupTypeText(param.getType().getText())
          const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

          return {
            name: escapeParameterNameForMDX(paramName),
            type: paramType,
            required: !param.isOptional(),
            description: escapeTextForMDX(paramJsDoc) || "",
          }
        })

        const returnType = cleanupTypeText(
          initializer.getReturnType().getText()
        )

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
          Object.entries(jsDocInfo.params).forEach(([paramName, paramDesc]) => {
            parameters.push({
              name: escapeParameterNameForMDX(paramName),
              type: "any", // Default type since we can't infer from call expressions
              required: true, // Default to required
              description: escapeTextForMDX(paramDesc) || "",
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
      for (const sf of referencedSourceFiles) {
        const fileName = path.basename(sf.getFilePath(), ".ts")
        const moduleFileName = path.basename(moduleSpecifier, ".ts")

        if (
          fileName === moduleFileName ||
          sf.getFilePath().includes(moduleSpecifier) ||
          sf.getFilePath().includes(moduleSpecifier.replace("./", ""))
        ) {
          referencedSourceFile = sf
          break
        }
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
        const hasExport = namedExports.some(
          namedExport => namedExport.getName() === exportName
        )

        if (hasExport) {
          const moduleSpec = exportDecl.getModuleSpecifier()
          if (moduleSpec) {
            const moduleSpecValue = moduleSpec.getLiteralValue()
            // Recursively resolve from the module this export comes from
            return resolveReExportedFunction(
              referencedSourceFile,
              exportName,
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
