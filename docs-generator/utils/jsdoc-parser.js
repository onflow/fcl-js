function parseJsDoc(node) {
  try {
    // Try to get JSDoc using the standard API
    if (typeof node.getJsDocs === "function") {
      const jsDocs = node.getJsDocs()
      if (jsDocs && jsDocs.length > 0) {
        const jsDoc = jsDocs[0]

        // Parse tags if available
        let parsedTags = {}
        let description = ""

        if (typeof jsDoc.getTags === "function") {
          const tags = jsDoc.getTags()

          tags.forEach(tag => {
            const tagName = tag.getTagName()
            let comment = ""

            // Try to get comment text
            if (typeof tag.getComment === "function") {
              comment = tag.getComment() || ""
            }

            // Parse different tag types
            if (tagName === "description") {
              description = comment
            }
            // Parse param tags
            else if (tagName === "param") {
              if (!parsedTags.params) parsedTags.params = {}

              // Try to get parameter name from the tag
              let paramName = ""
              if (typeof tag.getName === "function") {
                paramName = tag.getName()
              }

              // If no name found, try to extract from comment
              if (!paramName && comment) {
                const paramMatch = comment.match(/^(\w+[\.\w]*)\s+(.*)$/)
                if (paramMatch) {
                  paramName = paramMatch[1]
                  comment = paramMatch[2]
                }
              }

              if (paramName) {
                parsedTags.params[paramName] = comment
              }
            }
            // Parse return tag
            else if (tagName === "returns" || tagName === "return") {
              // Handle multiple @returns tags by concatenating them
              if (parsedTags.returns) {
                parsedTags.returns += `\n• ${comment}`
              } else {
                parsedTags.returns = comment
              }
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

        // If no description from tags, try to get from JSDoc description
        if (!description && typeof jsDoc.getDescription === "function") {
          description = jsDoc.getDescription() || ""
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
      if (parent && typeof parent.getParent === "function") {
        const grandparent = parent.getParent()
        if (grandparent && typeof grandparent.getJsDocs === "function") {
          const parentJsDocs = grandparent.getJsDocs()
          if (parentJsDocs && parentJsDocs.length > 0) {
            const jsDoc = parentJsDocs[0]

            // Parse tags if available
            let parsedTags = {}
            let description = ""

            if (typeof jsDoc.getTags === "function") {
              const tags = jsDoc.getTags()

              tags.forEach(tag => {
                const tagName = tag.getTagName()
                let comment = ""

                // Try to get comment text
                if (typeof tag.getComment === "function") {
                  comment = tag.getComment() || ""
                }

                // Parse different tag types
                if (tagName === "description") {
                  description = comment
                }
                // Parse param tags
                else if (tagName === "param") {
                  if (!parsedTags.params) parsedTags.params = {}

                  // Try to get parameter name from the tag
                  let paramName = ""
                  if (typeof tag.getName === "function") {
                    paramName = tag.getName()
                  }

                  // If no name found, try to extract from comment
                  if (!paramName && comment) {
                    const paramMatch = comment.match(/^(\w+[\.\w]*)\s+(.*)$/)
                    if (paramMatch) {
                      paramName = paramMatch[1]
                      comment = paramMatch[2]
                    }
                  }

                  if (paramName) {
                    parsedTags.params[paramName] = comment
                  }
                }
                // Parse return tag
                else if (tagName === "returns" || tagName === "return") {
                  // Handle multiple @returns tags by concatenating them
                  if (parsedTags.returns) {
                    parsedTags.returns += `\n• ${comment}`
                  } else {
                    parsedTags.returns = comment
                  }
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

            // If no description from tags, try to get from JSDoc description
            if (!description && typeof jsDoc.getDescription === "function") {
              description = jsDoc.getDescription() || ""
            }

            return {
              description: description.trim(),
              ...parsedTags,
            }
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

module.exports = {
  parseJsDoc,
}
