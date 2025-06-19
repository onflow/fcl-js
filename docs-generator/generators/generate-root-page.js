const path = require("path")
const fs = require("fs")
const {generatePage, parseConfigCustomData} = require("./utils")

function getPackageDescription(packageName) {
  try {
    const packageJsonPath = path.resolve(
      process.cwd(),
      "..",
      packageName,
      "package.json"
    )
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
      return packageJson.description || ""
    }
  } catch (error) {
    console.warn(
      `Error reading package.json for ${packageName}: ${error.message}`
    )
  }
  return ""
}

function generateRootPage(templates, packagesDir, currentPackageName) {
  const configPath = path.resolve(process.cwd(), "docs-generator.config.js")
  const {displayName} = parseConfigCustomData(configPath)

  const currentDisplayName = displayName || `@onflow/${currentPackageName}`
  const currentPackageDescription =
    getPackageDescription(currentPackageName) ||
    `${currentPackageName} package documentation.`
  const rootPagePath = path.join(packagesDir, "index.md")
  const packages = []

  // Read existing packages from the file if it exists
  if (fs.existsSync(rootPagePath)) {
    try {
      const content = fs.readFileSync(rootPagePath, "utf8")
      const regex = /\- \[(.*?)\]\(\.\/(.*?)\/index\.md\)/g
      let match
      while ((match = regex.exec(content)) !== null) {
        if (match[1] && match[2]) {
          packages.push({
            displayName: match[1],
            packageName: match[2],
            displayDescription: getPackageDescription(match[2]),
          })
        }
      }
    } catch (error) {
      console.warn(`Error reading root page: ${error.message}`)
    }
  }

  // Check if current package already exists
  const packageExists = packages.some(
    pkg => pkg.packageName === currentPackageName
  )
  // Add it if not already in the list
  if (!packageExists) {
    packages.push({
      displayName: currentDisplayName,
      packageName: currentPackageName,
      displayDescription: currentPackageDescription,
    })
  }
  // Sort packages by display name
  packages.sort((a, b) => a.displayName.localeCompare(b.displayName))

  // Generate the root page
  generatePage(templates, "root", rootPagePath, {packages})
}

module.exports = {generateRootPage}
