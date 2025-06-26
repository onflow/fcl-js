const fs = require("fs")
const path = require("path")
const {Project, Node} = require("ts-morph")
const Handlebars = require("handlebars")
const {
  generateRootPage,
  generatePackagePage,
  generateFunctionPage,
  generateTypesPage,
} = require("./generators")

function parseJsDoc(node) {
  try {
    // Try to get JSDoc using the standard API
    if (typeof node.getJsDocs === "function") {
      const jsDocs = node.getJsDocs()
      if (jsDocs && jsDocs.length > 0) {
        const jsDoc = jsDocs[0]
        const description = jsDoc.getDescription() || ""

        // Parse tags if available
        let parsedTags = {}
        if (typeof jsDoc.getTags === "function") {
          const tags = jsDoc.getTags()

          tags.forEach(tag => {
            const tagName = tag.getTagName()
            const comment = tag.getComment() || ""

            // Parse param tags
            if (tagName === "param") {
              if (!parsedTags.params) parsedTags.params = {}
              const paramName = tag.getName()
              if (paramName) {
                parsedTags.params[paramName] = comment
              }
            }
            // Parse return tag
            else if (tagName === "returns" || tagName === "return") {
              parsedTags.returns = comment
            }
            // Parse example tag
            else if (tagName === "example") {
              parsedTags.example = comment
            }
            // Store any other tags
            else {
              parsedTags[tagName] = comment
            }
          })
        }

        return {
          description: description.trim(),
          ...parsedTags,
        }
      }
    }

    // For variable declarations, check the parent VariableStatement for JSDoc
    if (typeof node.getParent === "function") {
      const parent = node.getParent()
      if (parent && typeof parent.getJsDocs === "function") {
        const parentJsDocs = parent.getJsDocs()
        if (parentJsDocs && parentJsDocs.length > 0) {
          const jsDoc = parentJsDocs[0]
          const description = jsDoc.getDescription() || ""

          // Parse tags if available
          let parsedTags = {}
          if (typeof jsDoc.getTags === "function") {
            const tags = jsDoc.getTags()

            tags.forEach(tag => {
              const tagName = tag.getTagName()
              const comment = tag.getComment() || ""

              // Parse param tags
              if (tagName === "param") {
                if (!parsedTags.params) parsedTags.params = {}
                const paramName = tag.getName()
                if (paramName) {
                  parsedTags.params[paramName] = comment
                }
              }
              // Parse return tag
              else if (tagName === "returns" || tagName === "return") {
                parsedTags.returns = comment
              }
              // Parse example tag
              else if (tagName === "example") {
                parsedTags.example = comment
              }
              // Store any other tags
              else {
                parsedTags[tagName] = comment
              }
            })
          }

          return {
            description: description.trim(),
            ...parsedTags,
          }
        }
      }
    }

    // Fallback: try to parse JSDoc from the node leading comments
    if (typeof node.getLeadingCommentRanges === "function") {
      const commentRanges = node.getLeadingCommentRanges()
      if (commentRanges && commentRanges.length > 0) {
        const commentText = commentRanges
          .map(range => range.getText())
          .join("\n")
        // Simple regex to extract JSDoc description
        const match = /\/\*\*\s*([\s\S]*?)\s*\*\//.exec(commentText)
        if (match && match[1]) {
          const description = match[1].replace(/^\s*\*\s?/gm, "").trim()
          return {description}
        }
      }
    }

    // Also try to get comments from parent node if current node doesn't have any
    if (typeof node.getParent === "function") {
      const parent = node.getParent()
      if (parent && typeof parent.getLeadingCommentRanges === "function") {
        const commentRanges = parent.getLeadingCommentRanges()
        if (commentRanges && commentRanges.length > 0) {
          const commentText = commentRanges
            .map(range => range.getText())
            .join("\n")
          // Simple regex to extract JSDoc description
          const match = /\/\*\*\s*([\s\S]*?)\s*\*\//.exec(commentText)
          if (match && match[1]) {
            const description = match[1].replace(/^\s*\*\s?/gm, "").trim()
            return {description}
          }
        }
      }
    }

    return {}
  } catch (e) {
    console.warn(`Error parsing JSDoc: ${e.message}`)
    return {}
  }
}

function resolveReExportedFunction(sourceFile, exportName, moduleSpecifier) {
  try {
    // Use ts-morph's built-in module resolution
    const referencedSourceFile = sourceFile
      .getReferencedSourceFiles()
      .find(sf => {
        const fileName = path.basename(sf.getFilePath())
        const moduleFileName = path.basename(moduleSpecifier)
        return (
          fileName.includes(moduleFileName) ||
          sf.getFilePath().includes(moduleSpecifier.replace(/^@onflow\//, ""))
        )
      })

    if (referencedSourceFile) {
      return findFunctionInSourceFile(referencedSourceFile, exportName)
    }

    // Fallback: try to get the module specifier source file directly
    const moduleSourceFile =
      sourceFile.getModuleSpecifierSourceFile(moduleSpecifier)
    if (moduleSourceFile) {
      return findFunctionInSourceFile(moduleSourceFile, exportName)
    }

    return null
  } catch (e) {
    console.warn(
      `Error resolving re-exported function ${exportName} from ${moduleSpecifier}: ${e.message}`
    )
    return null
  }
}

function findFunctionInSourceFile(sourceFile, functionName) {
  try {
    const exportedDeclarations = sourceFile.getExportedDeclarations()
    if (exportedDeclarations.has(functionName)) {
      const declarations = exportedDeclarations.get(functionName)

      for (const declaration of declarations) {
        let funcInfo = null

        // Handle function declarations
        if (Node.isFunctionDeclaration(declaration)) {
          const jsDocInfo = parseJsDoc(declaration)
          const parameters = declaration.getParameters().map(param => {
            const paramName = param.getName()
            const paramType = param.getType().getText()
            const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

            return {
              name: paramName,
              type: paramType,
              required: !param.isOptional(),
              description: paramJsDoc || "",
            }
          })

          const returnType = declaration.getReturnType().getText()
          const filePath = sourceFile.getFilePath()
          const relativeFilePath = path.relative(process.cwd(), filePath)

          funcInfo = {
            name: functionName,
            returnType,
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
              const paramType = param.getType().getText()
              const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

              return {
                name: paramName,
                type: paramType,
                required: !param.isOptional(),
                description: paramJsDoc || "",
              }
            })

            const returnType = initializer.getReturnType().getText()
            const filePath = sourceFile.getFilePath()
            const relativeFilePath = path.relative(process.cwd(), filePath)

            funcInfo = {
              name: functionName,
              returnType,
              parameters,
              description: jsDocInfo.description || "",
              customExample: jsDocInfo.example || "",
              sourceFilePath: relativeFilePath,
            }
          }
        }

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

function discoverWorkspacePackages() {
  try {
    // Get the workspace root (2 levels up from current package directory)
    const workspaceRoot = path.resolve(process.cwd(), "../..")
    const packagesDir = path.join(workspaceRoot, "packages")

    if (!fs.existsSync(packagesDir)) {
      console.warn("Packages directory not found, using current package only")
      return []
    }

    const packagePaths = []
    const packageDirs = fs
      .readdirSync(packagesDir, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const packageDir of packageDirs) {
      const srcPath = path.join(packagesDir, packageDir, "src")
      if (fs.existsSync(srcPath)) {
        packagePaths.push(`${srcPath}/**/*.ts`)
      }
    }

    return packagePaths
  } catch (e) {
    console.warn(`Error discovering workspace packages: ${e.message}`)
    return []
  }
}

function extractFunctions(sourceFile) {
  const functions = []
  const filePath = sourceFile.getFilePath()
  // Convert absolute path to relative path from workspace root
  const relativeFilePath = path.relative(process.cwd(), filePath)

  try {
    // Get all exported functions from source file with relevant info
    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      declarations.forEach(declaration => {
        try {
          let funcInfo = null

          // Handle function declarations
          if (Node.isFunctionDeclaration(declaration)) {
            const jsDocInfo = parseJsDoc(declaration)
            const parameters = declaration.getParameters().map(param => {
              const paramName = param.getName()
              const paramType = param.getType().getText()
              const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

              return {
                name: paramName,
                type: paramType,
                required: !param.isOptional(),
                description: paramJsDoc || "",
              }
            })

            const returnType = declaration.getReturnType().getText()

            funcInfo = {
              name,
              returnType,
              parameters,
              description: jsDocInfo.description || "",
              customExample: jsDocInfo.example || "",
              sourceFilePath: relativeFilePath,
            }
          }
          // Handle variable declarations with function values
          else if (Node.isVariableDeclaration(declaration)) {
            // For const declarations, we need to check multiple places for JSDoc
            let jsDocInfo = parseJsDoc(declaration)

            // If no JSDoc found on the declaration, try the parent VariableDeclarationList
            if (!jsDocInfo.description) {
              const parentList = declaration.getParent()
              if (parentList) {
                jsDocInfo = parseJsDoc(parentList)
              }
            }

            // If still no JSDoc found, try the parent VariableStatement
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
                const paramType = param.getType().getText()
                const paramJsDoc =
                  jsDocInfo.params && jsDocInfo.params[paramName]

                return {
                  name: paramName,
                  type: paramType,
                  required: !param.isOptional(),
                  description: paramJsDoc || "",
                }
              })

              const returnType = initializer.getReturnType().getText()

              funcInfo = {
                name,
                returnType,
                parameters,
                description: jsDocInfo.description || "",
                customExample: jsDocInfo.example || "",
                sourceFilePath: relativeFilePath,
              }
            }
          }
          // Handle re-export declarations
          else if (Node.isExportDeclaration(declaration)) {
            const moduleSpecifier = declaration.getModuleSpecifier()
            if (moduleSpecifier) {
              const moduleSpecifierValue = moduleSpecifier.getLiteralValue()

              // Check if this is a named export that we need to follow
              const namedExports = declaration.getNamedExports()
              for (const namedExport of namedExports) {
                const exportName = namedExport.getName()
                if (exportName === name) {
                  // This is a re-export, try to resolve it using ts-morph
                  const reExportedFuncInfo = resolveReExportedFunction(
                    sourceFile,
                    exportName,
                    moduleSpecifierValue
                  )
                  if (reExportedFuncInfo) {
                    funcInfo = reExportedFuncInfo
                    console.log(
                      `Successfully resolved re-exported function: ${name}`
                    )
                  } else {
                    console.warn(
                      `Could not resolve re-exported function: ${name} from ${moduleSpecifierValue}`
                    )
                  }
                  break
                }
              }
            }
          }

          if (funcInfo) {
            functions.push(funcInfo)
          }
        } catch (e) {
          console.warn(`Error processing declaration ${name}: ${e.message}`)
        }
      })
    })
  } catch (e) {
    console.warn(
      `Error extracting functions from ${sourceFile.getFilePath()}: ${e.message}`
    )
  }

  return functions
}

async function main() {
  try {
    // Extract package name from the name field of the package where the command is run (@onflow/fcl -> fcl)
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")
    )
    const packageName = packageJson.name.split("/").pop()
    console.log(`Generating docs for ${packageName}...`)

    // Configuration with updated directory structure
    const SOURCE_DIR = path.resolve(process.cwd(), "src")
    const TEMPLATES_DIR = path.resolve(__dirname, "./templates")
    const OUTPUT_DIR = path.resolve(__dirname, "./output")

    const ROOT_DIR = path.join(OUTPUT_DIR, "packages-docs")
    const PACKAGE_DIR = path.join(ROOT_DIR, packageName)
    const TYPES_DIR = path.join(ROOT_DIR, "types")

    // Ensure output directories exist
    await fs.promises.mkdir(OUTPUT_DIR, {recursive: true})
    await fs.promises.mkdir(ROOT_DIR, {recursive: true})
    // Clean existing output directory content for the package before creating its folder
    await fs.promises.rm(PACKAGE_DIR, {recursive: true, force: true})
    await fs.promises.mkdir(PACKAGE_DIR, {recursive: true})
    await fs.promises.mkdir(TYPES_DIR, {recursive: true})

    // Handlebars templates to be used for generating the docs
    const templates = {
      root: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "root.hbs"), "utf8")
      ),
      package: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "package.hbs"), "utf8")
      ),
      function: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "function.hbs"), "utf8")
      ),
      types: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "types.hbs"), "utf8")
      ),
    }

    // Initialize ts-morph project and add source files
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
    })

    // Add source files from the current package
    project.addSourceFilesAtPaths(`${SOURCE_DIR}/**/*.ts`)

    // Automatically discover and add all workspace packages
    const workspacePackagePaths = discoverWorkspacePackages()
    for (const packagePath of workspacePackagePaths) {
      try {
        project.addSourceFilesAtPaths(packagePath)
      } catch (e) {
        console.warn(
          `Could not add source files from ${packagePath}: ${e.message}`
        )
      }
    }

    // Collect exported functions from all files
    const functions = []
    project.getSourceFiles().forEach(sourceFile => {
      // Skip test files
      if (
        sourceFile.getFilePath().includes(".test.") ||
        sourceFile.getFilePath().includes("/test/")
      ) {
        return
      }

      // Only process files from the current package's source directory
      const sourceFilePath = sourceFile.getFilePath()
      const normalizedSourceDir = path.resolve(SOURCE_DIR)
      const normalizedSourceFilePath = path.resolve(sourceFilePath)

      if (normalizedSourceFilePath.startsWith(normalizedSourceDir)) {
        const fileFunctions = extractFunctions(sourceFile)
        functions.push(...fileFunctions)
      }
    })

    // Generate documentation
    generateRootPage(templates, ROOT_DIR, packageName)
    generatePackagePage(templates, PACKAGE_DIR, packageName, functions)
    functions.forEach(func => {
      generateFunctionPage(templates, PACKAGE_DIR, packageName, func)
    })
    // Generate the types documentation
    generateTypesPage(templates, TYPES_DIR)

    console.log(`Docs generated correctly for ${packageName}.`)
    return true
  } catch (error) {
    console.error("Error generating docs:")
    console.error(error.message)
    console.error(error.stack)
    return false
  }
}

main().catch(error => {
  console.error("Unhandled error:")
  console.error(error.message || error)
  process.exit(1)
})
