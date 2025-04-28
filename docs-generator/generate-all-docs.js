const fs = require("fs")
const path = require("path")
const {execSync} = require("child_process")

async function main() {
  try {
    // Ensure the output directory exists
    const outputDir = path.resolve(__dirname, "./output")
    await fs.promises.mkdir(outputDir, {recursive: true})

    // Get packages directory
    const packagesDir = path.resolve(__dirname, "../packages")
    // Find packages with generate-docs script
    console.log(`Scanning for packages in ${packagesDir}`)
    const packages =
      fs.readdirSync(packagesDir).filter(name => {
        try {
          const packageJsonPath = path.join(packagesDir, name, "package.json")
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
      const pkgDir = path.join(packagesDir, pkg)
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
