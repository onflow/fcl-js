const path = require("path")
const {generatePage, getFirstWord} = require("./utils")

function truncateDescription(description, maxLength = 80) {
  if (!description || description.length <= maxLength) {
    // Still normalize whitespace even for short descriptions
    return description ? description.replace(/\s+/g, " ").trim() : description
  }

  // Remove line breaks and normalize whitespace
  const normalizedDescription = description.replace(/\s+/g, " ").trim()

  // Find the last space before the maxLength to avoid cutting words
  let truncateAt = maxLength
  const lastSpace = normalizedDescription.lastIndexOf(" ", maxLength)
  if (lastSpace > maxLength * 0.8) {
    // Only use space if it's not too far back
    truncateAt = lastSpace
  }

  return normalizedDescription.substring(0, truncateAt).trim() + "..."
}

function generateNamespacePage(templates, outputDir, packageName, namespace) {
  // Deduplicate functions with the same name
  const uniqueFunctions = []
  const seenFunctionNames = new Set()
  namespace.functions.forEach(func => {
    if (!seenFunctionNames.has(func.name)) {
      seenFunctionNames.add(func.name)
      uniqueFunctions.push(func)
    }
  })

  // Sort functions alphabetically, case insensitively
  uniqueFunctions.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )

  // Add lowercase_name property for use in templates (don't truncate descriptions for full page)
  uniqueFunctions.forEach(func => {
    func.lowercase_name = func.name.charAt(0).toLowerCase() + func.name.slice(1)
  })

  // Generate lowercase filename like functions
  const filename =
    namespace.name.charAt(0).toLowerCase() + namespace.name.slice(1)

  generatePage(templates, "namespace", path.join(outputDir, `${filename}.md`), {
    packageName,
    packageFirstWord: getFirstWord(packageName),
    namespaceName: namespace.name,
    namespaceDescription: namespace.description,
    functions: uniqueFunctions,
  })
}

module.exports = {generateNamespacePage}
