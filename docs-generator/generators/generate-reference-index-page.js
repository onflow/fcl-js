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
