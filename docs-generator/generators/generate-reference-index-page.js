const path = require("path")
const {generatePage} = require("./utils")

function generateReferenceIndexPage(
  templates,
  outputDir,
  packageName,
  functions
) {
  generatePage(
    templates,
    "referenceIndex",
    path.join(outputDir, "reference", "index.md"),
    {
      packageName,
      functions,
    }
  )
}

module.exports = {generateReferenceIndexPage}
