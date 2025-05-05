const fs = require("fs")
const path = require("path")
const {execSync} = require("child_process")

async function main() {
  try {
    // Ensure the base output directories exist
    const outputDir = path.resolve(__dirname, "./output")
    const fclDocsDir = path.join(outputDir, "fcl-docs")
    const outputPackagesDir = path.join(fclDocsDir, "packages")

    await fs.promises.mkdir(outputDir, {recursive: true})
    await fs.promises.mkdir(fclDocsDir, {recursive: true})
    await fs.promises.mkdir(outputPackagesDir, {recursive: true})

    // Get packages directory
    const sourcePackagesDir = path.resolve(__dirname, "../packages")
    // Find packages with generate-docs script
    console.log(`Scanning for packages in ${sourcePackagesDir}`)
    const packages =
      fs.readdirSync(sourcePackagesDir).filter(name => {
        try {
          const packageJsonPath = path.join(
            sourcePackagesDir,
            name,
            "package.json"
          )
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
          )
          return packageJson.scripts && packageJson.scripts["generate-docs"]
        } catch (error) {
          console.warn(`Error checking package ${name}: ${error.message}`)
          return false
        }
      }) || []
    if (packages.length === 0) {
      console.warn("No packages with generate-docs script were found.")
      return
    }
    console.log(`Found ${packages.length} packages with generate-docs script:`)
    packages.forEach(pkg => console.log(`- ${pkg}`))

    // Navigate to the package directory and run the generate-docs script
    for (const pkg of packages) {
      const pkgDir = path.join(sourcePackagesDir, pkg)
      execSync(`cd ${pkgDir} && npm run generate-docs`, {
        stdio: "inherit",
        env: {...process.env},
      })
      console.log("")
    }

    // Report results
    console.log(`All docs correctly generated.`)
  } catch (error) {
    console.error("Error:")
    console.error(error.message || error)
    process.exit(1)
  }
}

main().catch(error => {
  console.error("Unhandled error:")
  console.error(error.message || error)
  process.exit(1)
})
