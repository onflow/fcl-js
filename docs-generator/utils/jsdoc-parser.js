function parseJsDoc(node) {
  try {
    // Try to get JSDoc using the standard API
    if (typeof node.getJsDocs === "function") {
      const jsDocs = node.getJsDocs()
      if (jsDocs && jsDocs.length > 0) {
        const jsDoc = jsDocs[0]
        let description = ""

        // Get full JSDoc comment text and parse it manually for better extraction
        const jsDocText = jsDoc.getFullText()
        if (jsDocText) {
          // Extract description from JSDoc comment
          const descriptionMatch = jsDocText.match(
            /\/\*\*\s*([\s\S]*?)\s*(?:@|\*\/)/s
          )
          if (descriptionMatch && descriptionMatch[1]) {
            description = descriptionMatch[1]
              .split("\n")
              .map(line => line.replace(/^\s*\*\s?/, "").trim())
              .filter(line => line && !line.startsWith("@"))
              .join("\n")
              .trim()
          }
        }

        // Fallback to standard description if manual parsing failed
        if (!description) {
          description = jsDoc.getDescription() || ""
        }

        // Parse tags if available
        let parsedTags = {}
        if (typeof jsDoc.getTags === "function") {
          const tags = jsDoc.getTags()

          tags.forEach(tag => {
            const tagName = tag.getTagName()
            let comment = ""

            // Try to get comment text in multiple ways
            if (typeof tag.getComment === "function") {
              comment = tag.getComment() || ""
            }

            // If comment is empty, try to parse from full text
            if (!comment) {
              const tagText = tag.getFullText()
              if (tagText) {
                const commentMatch = tagText.match(/@\w+\s+(.*)$/s)
                if (commentMatch && commentMatch[1]) {
                  comment = commentMatch[1].trim()
                }
              }
            }

            // Parse param tags
            if (tagName === "param") {
              if (!parsedTags.params) parsedTags.params = {}
              const paramName = tag.getName ? tag.getName() : ""
              if (paramName) {
                parsedTags.params[paramName] = comment
              } else {
                // Try to extract param name from comment
                const paramMatch = comment.match(/^(\w+)\s+(.*)$/)
                if (paramMatch) {
                  parsedTags.params[paramMatch[1]] = paramMatch[2]
                }
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
          let description = ""

          // Get full JSDoc comment text and parse it manually for better extraction
          const jsDocText = jsDoc.getFullText()
          if (jsDocText) {
            // Extract description from JSDoc comment
            const descriptionMatch = jsDocText.match(
              /\/\*\*\s*([\s\S]*?)\s*(?:@|\*\/)/s
            )
            if (descriptionMatch && descriptionMatch[1]) {
              description = descriptionMatch[1]
                .split("\n")
                .map(line => line.replace(/^\s*\*\s?/, "").trim())
                .filter(line => line && !line.startsWith("@"))
                .join("\n")
                .trim()
            }
          }

          // Fallback to standard description if manual parsing failed
          if (!description) {
            description = jsDoc.getDescription() || ""
          }

          // Parse tags if available
          let parsedTags = {}
          if (typeof jsDoc.getTags === "function") {
            const tags = jsDoc.getTags()

            tags.forEach(tag => {
              const tagName = tag.getTagName()
              let comment = ""

              // Try to get comment text in multiple ways
              if (typeof tag.getComment === "function") {
                comment = tag.getComment() || ""
              }

              // If comment is empty, try to parse from full text
              if (!comment) {
                const tagText = tag.getFullText()
                if (tagText) {
                  const commentMatch = tagText.match(/@\w+\s+(.*)$/s)
                  if (commentMatch && commentMatch[1]) {
                    comment = commentMatch[1].trim()
                  }
                }
              }

              // Parse param tags
              if (tagName === "param") {
                if (!parsedTags.params) parsedTags.params = {}
                const paramName = tag.getName ? tag.getName() : ""
                if (paramName) {
                  parsedTags.params[paramName] = comment
                } else {
                  // Try to extract param name from comment
                  const paramMatch = comment.match(/^(\w+)\s+(.*)$/)
                  if (paramMatch) {
                    parsedTags.params[paramMatch[1]] = paramMatch[2]
                  }
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

module.exports = {
  parseJsDoc,
}
