const fs = require("fs")
const path = require("path")
const {Project} = require("ts-morph")
const Handlebars = require("handlebars")
const {
  generateRootPage,
  generatePackagePage,
  generateFunctionPage,
  generateTypesPage,
  generateNamespacePage,
} = require("./generators")
const {
  discoverWorkspacePackages,
  extractExportsFromEntryFile,
} = require("./utils")

async function main() {
  try {
    // Extract package name from the name field of the package where the command is run (@onflow/fcl -> fcl)
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")
    )
    const packageName = packageJson.name.split("/").pop()
    console.log(`Generating docs for ${packageName}...`)

    // Get the entry file from package.json source field
    const entryFile = packageJson.source || ""
    const ENTRY_FILE_PATH = path.resolve(process.cwd(), entryFile)

    // Configuration with updated directory structure
    const TEMPLATES_DIR = path.resolve(__dirname, "./templates")
    const OUTPUT_DIR = path.resolve(__dirname, "./output")

    const ROOT_DIR = path.join(OUTPUT_DIR, "packages-docs")
    const PACKAGE_DIR = path.join(ROOT_DIR, packageName)
    const TYPES_DIR = path.join(ROOT_DIR, "types")

    // Ensure output directories exist
    await fs.promises.mkdir(OUTPUT_DIR, {recursive: true})
    await fs.promises.mkdir(ROOT_DIR, {recursive: true})
    // Clean existing output directory content for the package before creating its folder
    await fs.promises.rm(PACKAGE_DIR, {recursive: true, force: true})
    await fs.promises.mkdir(PACKAGE_DIR, {recursive: true})
    await fs.promises.mkdir(TYPES_DIR, {recursive: true})

    // Handlebars templates to be used for generating the docs
    const templates = {
      root: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "root.hbs"), "utf8")
      ),
      package: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "package.hbs"), "utf8")
      ),
      function: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "function.hbs"), "utf8")
      ),
      types: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "types.hbs"), "utf8")
      ),
      namespace: Handlebars.compile(
        fs.readFileSync(path.join(TEMPLATES_DIR, "namespace.hbs"), "utf8")
      ),
    }

    // Initialize ts-morph project and add source files
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
    })
    // Add the entry file
    project.addSourceFileAtPath(ENTRY_FILE_PATH)
    // Automatically discover and add all workspace packages for resolving imports
    const workspacePackagePaths = discoverWorkspacePackages()
    for (const packagePath of workspacePackagePaths) {
      try {
        project.addSourceFilesAtPaths(packagePath)
      } catch (e) {
        console.warn(
          `Could not add source files from ${packagePath}: ${e.message}`
        )
      }
    }

    // Get the entry source file and extract exports from it
    const entrySourceFile = project.getSourceFile(ENTRY_FILE_PATH)
    const {functions, namespaces} = extractExportsFromEntryFile(entrySourceFile)
    console.log(
      `Found ${functions.length} functions and ${namespaces.length} namespaces`
    )

    // Collect all namespace functions for the package index
    let allNamespaceFunctions = []
    namespaces.forEach(namespace => {
      allNamespaceFunctions = allNamespaceFunctions.concat(namespace.functions)
    })

    // Generate documentation
    generateRootPage(templates, ROOT_DIR, packageName)
    generatePackagePage(
      templates,
      PACKAGE_DIR,
      packageName,
      functions,
      namespaces,
      allNamespaceFunctions
    )

    // Generate function pages for regular functions only
    functions.forEach(func => {
      generateFunctionPage(templates, PACKAGE_DIR, packageName, func)
    })

    // Generate single namespace pages (no individual function pages)
    namespaces.forEach(namespace => {
      generateNamespacePage(templates, PACKAGE_DIR, packageName, namespace)
    })

    // Generate the types documentation
    generateTypesPage(templates, TYPES_DIR)

    console.log(`Docs generated correctly for ${packageName}.`)
    return true
  } catch (error) {
    console.error("Error generating docs:")
    console.error(error.message)
    return false
  }
}

main().catch(error => {
  console.error("Unhandled error:")
  console.error(error.message || error)
  process.exit(1)
})
