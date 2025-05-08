const path = require("path")
const {generatePage, parseConfigCustomData} = require("./utils")

function generatePackageIndexPage(templates, outputDir, packageName) {
  const configPath = path.resolve(process.cwd(), "docs-generator.config.js")
  const {displayName} = parseConfigCustomData(configPath)

  generatePage(templates, "packageIndex", path.join(outputDir, "index.md"), {
    packageName,
    displayName: displayName || `${packageName} Reference`,
    customOverview: packageIndex.overview,
  })
}

module.exports = {generatePackageIndexPage}
