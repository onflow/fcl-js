const path = require("path")
const {Project, Node, TypeFormatFlags} = require("ts-morph")
const {generatePage} = require("./utils")

function decodeHtmlEntities(text) {
  if (!text) return text

  const decoded = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Escape also pipe characters which would break markdown tables
  return decoded.replace(/\|/g, "\\|")
}

function extractJSDocDescription(node) {
  if (!node) return null

  try {
    if (typeof node.getJsDocs === "function") {
      const jsDocs = node.getJsDocs()
      if (jsDocs && jsDocs.length > 0) {
        const jsDoc = jsDocs[0]
        const description = jsDoc.getDescription() || ""
        return description.trim() || null
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
          return description || null
        }
      }
    }
  } catch (error) {
    console.warn(`Error extracting JSDoc description: ${error.message}`)
  }
  return null
}

function extractInterfaces(sourceFiles) {
  const interfaces = []

  sourceFiles.forEach(sourceFile => {
    // Get exported interfaces
    sourceFile.getInterfaces().forEach(iface => {
      if (!iface.isExported()) return

      const name = iface.getName()
      const description = extractJSDocDescription(iface)

      // Extract properties
      const properties = iface.getProperties().map(prop => {
        const propName = prop.getName()
        const propType = decodeHtmlEntities(
          prop.getType().getText(undefined, TypeFormatFlags.None)
        )
        const propDescription = extractJSDocDescription(prop)

        return {
          name: propName,
          type: propType,
          description: propDescription,
        }
      })

      interfaces.push({
        name,
        description,
        properties,
      })
    })
  })
  // Sort interfaces alphabetically by name
  return interfaces.sort((a, b) => a.name.localeCompare(b.name))
}

function extractTypeAliases(sourceFiles) {
  const types = []

  sourceFiles.forEach(sourceFile => {
    // Get exported type aliases
    sourceFile.getTypeAliases().forEach(typeAlias => {
      if (!typeAlias.isExported()) return

      const name = typeAlias.getName()
      const description = extractJSDocDescription(typeAlias)
      const type = decodeHtmlEntities(
        typeAlias.getType().getText(undefined, TypeFormatFlags.None)
      )

      // For object types, try to extract properties
      const properties = []
      const aliasType = typeAlias.getType()

      if (aliasType.isObject()) {
        const propSymbols = aliasType.getProperties()

        propSymbols.forEach(propSymbol => {
          const propName = propSymbol.getName()
          let propType = "unknown"

          try {
            const valueDeclaration = propSymbol.getValueDeclaration()
            if (valueDeclaration) {
              if (Node.isPropertySignature(valueDeclaration)) {
                const typeNode = valueDeclaration.getTypeNode()
                if (typeNode) {
                  propType = typeNode.getText()
                }
              }
            }

            // If we couldn't get the type from the declaration, use the symbol's type
            if (propType === "unknown") {
              propType = propSymbol
                .getTypeAtLocation(typeAlias)
                .getText(undefined, TypeFormatFlags.None)
            }

            properties.push({
              name: propName,
              type: decodeHtmlEntities(propType),
              description:
                extractJSDocDescription(propSymbol.getDeclarations()[0]) ||
                null,
            })
          } catch (error) {
            console.warn(
              `Error extracting property ${propName} from type ${name}: ${error.message}`
            )
            properties.push({
              name: propName,
              type: "unknown",
              description: null,
            })
          }
        })
      }

      types.push({
        name,
        description,
        type,
        properties,
      })
    })
  })
  // Sort type aliases alphabetically by name
  return types.sort((a, b) => a.name.localeCompare(b.name))
}

function extractEnums(sourceFiles) {
  const enums = []

  sourceFiles.forEach(sourceFile => {
    // Get exported enums
    sourceFile.getEnums().forEach(enumDef => {
      if (!enumDef.isExported()) return

      const name = enumDef.getName()
      const description = extractJSDocDescription(enumDef)

      // Extract members
      const members = enumDef.getMembers().map(member => {
        const memberName = member.getName()
        const memberDescription = extractJSDocDescription(member)
        let memberValue = null

        // Try to get the value
        const valueNode = member.getInitializer()
        if (valueNode) {
          memberValue = valueNode.getText()
        }

        return {
          name: memberName,
          value: memberValue,
          description: memberDescription,
        }
      })

      enums.push({
        name,
        description,
        members,
      })
    })
  })
  // Sort enums alphabetically by name
  return enums.sort((a, b) => a.name.localeCompare(b.name))
}

function generateTypesIndexPage(templates, outputDir) {
  // Path to the typedefs package
  const typedefsDir = path.resolve(process.cwd(), "../typedefs")
  const typedefsSrcDir = path.join(typedefsDir, "src")

  // Initialize ts-morph project
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
  })
  // Add source files from typedefs package
  project.addSourceFilesAtPaths(`${typedefsSrcDir}/**/*.ts`)
  const sourceFiles = project.getSourceFiles()

  // Extract types data
  const interfaces = extractInterfaces(sourceFiles)
  const types = extractTypeAliases(sourceFiles)
  const enums = extractEnums(sourceFiles)

  // Generate the types index page
  generatePage(templates, "typesIndex", path.join(outputDir, "index.md"), {
    interfaces,
    types,
    enums,
  })
}

module.exports = {generateTypesIndexPage}
