const path = require("path")
const {generatePage, parseConfigCustomData} = require("./utils")

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
  // Add lowercase_name property for use in templates
  uniqueFunctions.forEach(func => {
    func.lowercase_name = func.name.charAt(0).toLowerCase() + func.name.slice(1)
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
