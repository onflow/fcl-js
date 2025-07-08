const path = require("path")
const {Node} = require("ts-morph")
const {extractFunctionInfo} = require("./function-extractor")

function extractNamespaceFunctions(
  sourceFile,
  namespaceName,
  importedNamespace
) {
  const functions = []

  try {
    // Get the imported namespace source file
    const moduleSpecifier = importedNamespace.getModuleSpecifier()
    if (!moduleSpecifier) {
      console.warn(`No module specifier for namespace ${namespaceName}`)
      return functions
    }

    const moduleSpecifierValue = moduleSpecifier.getLiteralValue()

    // Skip external packages (those starting with @, or not starting with ./)
    if (
      moduleSpecifierValue.startsWith("@") ||
      (!moduleSpecifierValue.startsWith(".") &&
        !moduleSpecifierValue.startsWith("/"))
    ) {
      // This is an external package, silently skip
      return functions
    }

    // Find the source file using the same logic as resolveReExportedFunction
    const referencedSourceFiles = sourceFile.getReferencedSourceFiles()
    let namespaceSourceFile = null

    // Find the source file that matches the module specifier
    for (const sf of referencedSourceFiles) {
      const fileName = path.basename(sf.getFilePath(), ".ts")
      const moduleFileName = path.basename(moduleSpecifierValue, ".ts")

      if (
        fileName === moduleFileName ||
        sf.getFilePath().includes(moduleSpecifierValue) ||
        sf.getFilePath().includes(moduleSpecifierValue.replace("./", ""))
      ) {
        namespaceSourceFile = sf
        break
      }
    }

    if (!namespaceSourceFile) {
      // Only warn for internal modules (those starting with ./ or ../)
      if (
        moduleSpecifierValue.startsWith("./") ||
        moduleSpecifierValue.startsWith("../")
      ) {
        console.warn(
          `Could not find source file for namespace ${namespaceName} from ${moduleSpecifierValue}`
        )
      }
      return functions
    }

    // Get all exported declarations from the namespace
    namespaceSourceFile
      .getExportedDeclarations()
      .forEach((declarations, name) => {
        declarations.forEach(declaration => {
          const funcInfo = extractFunctionInfo(
            declaration,
            name,
            namespaceSourceFile,
            namespaceName
          )

          if (funcInfo) {
            functions.push(funcInfo)
          }
        })
      })
  } catch (e) {
    console.warn(
      `Error extracting functions from namespace ${namespaceName}: ${e.message}`
    )
  }

  return functions
}

module.exports = {
  extractNamespaceFunctions,
}
