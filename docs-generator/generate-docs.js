const fs = require("fs")
const path = require("path")
const {Project, Node} = require("ts-morph")
const Handlebars = require("handlebars")
const {
  generatePackageIndexPage,
  generateInstallationPage,
  generateReferenceIndexPage,
  generateFunctionPage,
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

    return {}
  } catch (e) {
    console.warn(`Error parsing JSDoc: ${e.message}`)
    return {}
  }
}

function extractFunctions(sourceFile) {
  const functions = []

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
            }
          }
          // Handle variable declarations with function values
          else if (Node.isVariableDeclaration(declaration)) {
            const jsDocInfo = parseJsDoc(declaration)
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

async function main(packageName, sourceDir, outputDir, templatesDir) {
  console.log(`Generating docs for ${packageName}...`)

  try {
    // Clean existing output directory
    await fs.promises.rm(outputDir, {recursive: true, force: true})

    // Create output directories if they don't exist
    await fs.promises.mkdir(outputDir, {recursive: true})
    await fs.promises.mkdir(path.join(outputDir, "installation"), {
      recursive: true,
    })
    await fs.promises.mkdir(path.join(outputDir, "reference"), {
      recursive: true,
    })

    // Handlebars templates to be used for generating the docs
    const templates = {
      packageIndex: Handlebars.compile(
        fs.readFileSync(path.join(templatesDir, "package-index.hbs"), "utf8")
      ),
      installation: Handlebars.compile(
        fs.readFileSync(path.join(templatesDir, "installation.hbs"), "utf8")
      ),
      referenceIndex: Handlebars.compile(
        fs.readFileSync(path.join(templatesDir, "reference-index.hbs"), "utf8")
      ),
      function: Handlebars.compile(
        fs.readFileSync(path.join(templatesDir, "function.hbs"), "utf8")
      ),
    }

    // Initialize ts-morph project and add source files
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
    })
    project.addSourceFilesAtPaths(`${sourceDir}/**/*.ts`)
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

    // Generate single page documentation
    generateInstallationPage(templates, outputDir, packageName)
    generatePackageIndexPage(templates, outputDir, packageName)
    generateReferenceIndexPage(templates, outputDir, packageName, functions)
    functions.forEach(func => {
      generateFunctionPage(templates, outputDir, packageName, func)
    })

    console.log(`Docs generated in the ${outputDir} directory.`)
    return true
  } catch (error) {
    console.error("Error generating docs:")
    console.error(error.message)
    console.error(error.stack)
    return false
  }
}

// Get package name from arguments
const args = process.argv.slice(2)
if (args.length < 1) {
  console.error("Error: Package name is required.")
  console.error("Usage: node generate-docs.js <packageName>")
  process.exit(1)
}

// Configuration
const PACKAGE_NAME = args[0]
const SOURCE_DIR = path.resolve(process.cwd(), "src")
const OUTPUT_DIR = path.resolve(__dirname, "./output", PACKAGE_NAME)
const TEMPLATES_DIR = path.resolve(__dirname, "./templates")

main(PACKAGE_NAME, SOURCE_DIR, OUTPUT_DIR, TEMPLATES_DIR).catch(error => {
  console.error("Unhandled error:")
  console.error(error.message || error)
  process.exit(1)
})
