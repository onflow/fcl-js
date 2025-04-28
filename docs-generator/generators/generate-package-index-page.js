const path = require("path")
const {generatePage, parseConfigCustomData} = require("./utils")

function generatePackageIndexPage(templates, outputDir, packageName) {
  const configPath = path.resolve(process.cwd(), "docs-generator.config.js")
  const {packageIndex} = parseConfigCustomData(configPath)

  generatePage(templates, "packageIndex", path.join(outputDir, "index.md"), {
    packageName,
    customOverview: packageIndex.overview,
  })
}

module.exports = {generatePackageIndexPage}
