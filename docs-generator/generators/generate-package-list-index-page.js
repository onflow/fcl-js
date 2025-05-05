const path = require("path")
const fs = require("fs")
const {generatePage} = require("./utils")

function generatePackageListIndexPage(
  templates,
  packagesDir,
  currentPackageName
) {
  const packagesIndexPath = path.join(packagesDir, "index.md")
  let packages = []

  // If the packages index already exists, read it to get existing packages
  if (fs.existsSync(packagesIndexPath)) {
    try {
      const content = fs.readFileSync(packagesIndexPath, "utf8")
      // Extract package names from the markdown list
      const packageMatches = content.match(/\- \[(.*?)\]\(/g)
      if (packageMatches) {
        packages = packageMatches.map(match =>
          match.replace("- [", "").replace("](", "")
        )
      }
    } catch (error) {
      console.warn(`Error reading packages index: ${error.message}`)
    }
  }
  // Add the current package if it's not already in the list
  if (!packages.includes(currentPackageName)) {
    packages.push(currentPackageName)
  }
  // Sort packages alphabetically
  packages.sort()

  // Generate the packages index page
  generatePage(templates, "packageListIndex", packagesIndexPath, {packages})
}

module.exports = {generatePackageListIndexPage}
