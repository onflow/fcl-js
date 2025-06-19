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
    project.addSourceFilesAtPaths(`${SOURCE_DIR}/**/*.ts`)
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
      const fileFunctions = extractFunctions(sourceFile)
      functions.push(...fileFunctions)
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
