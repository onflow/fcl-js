const fs = require("fs")
const path = require("path")

function discoverWorkspacePackages() {
  try {
    // Get the workspace root (2 levels up from current package directory)
    const workspaceRoot = path.resolve(process.cwd(), "../..")
    const packagesDir = path.join(workspaceRoot, "packages")

    if (!fs.existsSync(packagesDir)) {
      console.warn("Packages directory not found, using current package only")
      return []
    }

    const packagePaths = []
    const packageDirs = fs
      .readdirSync(packagesDir, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const packageDir of packageDirs) {
      const srcPath = path.join(packagesDir, packageDir, "src")
      if (fs.existsSync(srcPath)) {
        packagePaths.push(`${srcPath}/**/*.ts`)
      }
    }

    return packagePaths
  } catch (e) {
    console.warn(`Error discovering workspace packages: ${e.message}`)
    return []
  }
}

module.exports = {
  discoverWorkspacePackages,
}
