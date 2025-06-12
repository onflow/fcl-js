const path = require("path")
const {generatePage, parseConfigCustomData} = require("./utils")

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

function generatePackagePage(templates, outputDir, packageName, functions) {
  const configPath = path.resolve(process.cwd(), "docs-generator.config.js")
  const {displayName, sections, extra} = parseConfigCustomData(configPath)

  // Deduplicate functions with the same name
  const uniqueFunctions = []
  const seenFunctionNames = new Set()
  functions.forEach(func => {
    if (!seenFunctionNames.has(func.name)) {
      seenFunctionNames.add(func.name)
      uniqueFunctions.push(func)
    }
  })
  // Sort functions alphabetically, case insensitively
  uniqueFunctions.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
  // Add lowercase_name property and truncate descriptions for use in templates
  uniqueFunctions.forEach(func => {
    func.lowercase_name = func.name.charAt(0).toLowerCase() + func.name.slice(1)
    func.description = truncateDescription(func.description)
  })

  generatePage(templates, "package", path.join(outputDir, "index.md"), {
    packageName,
    displayName: displayName || `@onflow/${packageName}`,
    customOverview: sections.overview,
    customRequirements: sections.requirements,
    customImporting: sections.importing,
    extra,
    functions: uniqueFunctions,
  })
}

module.exports = {generatePackagePage}
