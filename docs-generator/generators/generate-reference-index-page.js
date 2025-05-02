const path = require("path")
const {generatePage} = require("./utils")

function generateReferenceIndexPage(
  templates,
  outputDir,
  packageName,
  functions
) {
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

  generatePage(
    templates,
    "referenceIndex",
    path.join(outputDir, "reference", "index.md"),
    {
      packageName,
      functions: uniqueFunctions,
    }
  )
}

module.exports = {generateReferenceIndexPage}
