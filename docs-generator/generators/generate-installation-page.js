const path = require("path")
const {generatePage, parseConfigCustomData} = require("./utils")

function generateInstallationPage(templates, outputDir, packageName) {
  const configPath = path.resolve(process.cwd(), "docs-generator.config.js")
  const {installation} = parseConfigCustomData(configPath)

  generatePage(
    templates,
    "installation",
    path.join(outputDir, "installation", "index.md"),
    {
      packageName,
      customRequirements: installation.requirements,
      customImporting: installation.importing,
      customExtra: installation.extra,
    }
  )
}

module.exports = {generateInstallationPage}
