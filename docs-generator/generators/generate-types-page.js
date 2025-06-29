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

function extractConstBasedTypes(sourceFiles) {
  const constBasedTypes = []

  sourceFiles.forEach(sourceFile => {
    // Get exported type aliases
    sourceFile.getTypeAliases().forEach(typeAlias => {
      if (!typeAlias.isExported()) return

      const name = typeAlias.getName()
      const typeText = typeAlias.getTypeNode()?.getText() || ""

      // Check if this is a template literal type based on a const object
      // Pattern: (typeof SomeName)[keyof typeof SomeName]
      const templateLiteralPattern = /\(typeof\s+(\w+)\)\[keyof\s+typeof\s+\1\]/
      const match = typeText.match(templateLiteralPattern)

      if (match) {
        const constName = match[1]

        // Find the corresponding const object in the same file
        const constDeclaration = sourceFile.getVariableStatement(stmt => {
          const declarations = stmt.getDeclarations()
          return declarations.some(decl => {
            if (decl.getName() !== constName || !decl.hasExportKeyword()) {
              return false
            }

            const initializer = decl.getInitializer()
            if (!initializer) return false

            // Check for direct object literal
            if (Node.isObjectLiteralExpression(initializer)) {
              return true
            }

            // Check for object literal with 'as const' assertion
            if (Node.isAsExpression(initializer)) {
              return Node.isObjectLiteralExpression(initializer.getExpression())
            }

            return false
          })
        })

        if (constDeclaration) {
          const constVarDecl = constDeclaration
            .getDeclarations()
            .find(decl => decl.getName() === constName)
          const description =
            extractJSDocDescription(typeAlias) ||
            extractJSDocDescription(constVarDecl)

          // Extract properties from the const object
          const members = []
          const initializer = constVarDecl.getInitializer()

          let objectLiteral = null
          if (Node.isObjectLiteralExpression(initializer)) {
            objectLiteral = initializer
          } else if (Node.isAsExpression(initializer)) {
            const expression = initializer.getExpression()
            if (Node.isObjectLiteralExpression(expression)) {
              objectLiteral = expression
            }
          }

          if (objectLiteral) {
            objectLiteral.getProperties().forEach(prop => {
              if (Node.isPropertyAssignment(prop)) {
                const memberName = prop.getName()
                const memberValue = prop.getInitializer()?.getText()

                // Try to extract JSDoc from leading comments
                let memberDescription = null
                const leadingComments = prop.getLeadingCommentRanges()
                if (leadingComments && leadingComments.length > 0) {
                  const commentText = leadingComments
                    .map(range => range.getText())
                    .join("\n")
                  // Extract single-line comments
                  const singleLineMatch = /\/\/\s*(.+)/.exec(commentText)
                  if (singleLineMatch) {
                    memberDescription = singleLineMatch[1].trim()
                  }
                }

                members.push({
                  name: memberName,
                  value: memberValue,
                  description: memberDescription,
                })
              }
            })
          }

          constBasedTypes.push({
            name,
            description,
            members,
            importStatement: `import { ${name} } from "@onflow/fcl"`,
          })
        }
      }
    })
  })

  return constBasedTypes.sort((a, b) => a.name.localeCompare(b.name))
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
        importStatement: `import { type ${name} } from "@onflow/fcl"`,
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
      const typeText = typeAlias.getTypeNode()?.getText() || ""

      // Skip template literal types based on const objects - they'll be handled by extractConstBasedTypes
      const templateLiteralPattern = /\(typeof\s+(\w+)\)\[keyof\s+typeof\s+\1\]/
      if (templateLiteralPattern.test(typeText)) {
        return
      }

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
        importStatement: `import { type ${name} } from "@onflow/fcl"`,
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
        importStatement: `import { ${name} } from "@onflow/fcl"`,
      })
    })
  })
  // Sort enums alphabetically by name
  return enums.sort((a, b) => a.name.localeCompare(b.name))
}

function generateTypesPage(templates, outputDir) {
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
  const constBasedTypes = extractConstBasedTypes(sourceFiles)

  // Combine regular types with const-based types
  const allTypes = [...types, ...constBasedTypes]

  // Generate the types index page
  generatePage(templates, "types", path.join(outputDir, "index.md"), {
    interfaces,
    types: allTypes,
    enums,
  })
}

module.exports = {generateTypesPage}
