const path = require("path")
const {Node} = require("ts-morph")
const {parseJsDoc} = require("./jsdoc-parser")
const {
  extractFunctionInfo,
  resolveReExportedFunction,
} = require("./function-extractor")
const {extractNamespaceFunctions} = require("./namespace-utils")

function extractExportsFromEntryFile(sourceFile) {
  const functions = []
  const namespaces = []
  const filePath = sourceFile.getFilePath()
  const relativeFilePath = path.relative(process.cwd(), filePath)

  try {
    // Get all import declarations to track namespaces
    const importDeclarations = sourceFile.getImportDeclarations()
    const actualNamespaceImports = new Map() // Only for "import * as X" style imports
    const namedImports = new Map() // For regular named imports like "import {build}"
    const typeOnlyImports = new Set() // Track type-only imports

    importDeclarations.forEach(importDecl => {
      // Skip entire type-only import declarations
      if (importDecl.isTypeOnly && importDecl.isTypeOnly()) {
        return
      }

      // Handle regular named imports
      const namedImportsList = importDecl.getNamedImports()
      namedImportsList.forEach(namedImport => {
        const name = namedImport.getName()

        // Check if this is a type-only import (either the import declaration or the named import)
        if (
          namedImport.isTypeOnly() ||
          (importDecl.isTypeOnly && importDecl.isTypeOnly())
        ) {
          typeOnlyImports.add(name)
          return // Skip adding to namedImports
        }

        namedImports.set(name, importDecl)
      })

      // Handle actual namespace imports like "import * as types"
      const namespaceImport = importDecl.getNamespaceImport()
      if (namespaceImport) {
        const name = namespaceImport.getText()
        // Only add if it's not a type-only import
        if (!(importDecl.isTypeOnly && importDecl.isTypeOnly())) {
          actualNamespaceImports.set(name, importDecl)
        }
      }
    })

    // Get all export declarations to find re-exports and namespace exports with aliases
    sourceFile.getExportDeclarations().forEach(exportDecl => {
      // Skip type-only exports
      if (exportDecl.isTypeOnly()) {
        return
      }

      const namedExports = exportDecl.getNamedExports()
      namedExports.forEach(namedExport => {
        // Skip type-only named exports
        if (namedExport.isTypeOnly()) {
          return
        }

        const exportName = namedExport.getName()
        const alias = namedExport.getAliasNode()?.getText()
        const finalName = alias || exportName

        // Skip if this is a type-only import
        if (typeOnlyImports.has(exportName)) {
          return
        }

        // Check if this is a re-export from another module
        const moduleSpecifier = exportDecl.getModuleSpecifier()
        if (moduleSpecifier) {
          const moduleSpecifierValue = moduleSpecifier.getLiteralValue()
          const reExportedFuncInfo = resolveReExportedFunction(
            sourceFile,
            exportName,
            moduleSpecifierValue
          )
          if (reExportedFuncInfo) {
            reExportedFuncInfo.name = finalName
            functions.push(reExportedFuncInfo)
          }
        } else {
          // This is an export of something imported - check if it's an actual namespace
          if (
            actualNamespaceImports.has(exportName) &&
            !typeOnlyImports.has(exportName)
          ) {
            const importDecl = actualNamespaceImports.get(exportName)
            const namespaceFunctions = extractNamespaceFunctions(
              sourceFile,
              exportName,
              importDecl
            )
            // Only add as namespace if it actually has functions
            if (namespaceFunctions.length > 0) {
              namespaces.push({
                name: finalName,
                functions: namespaceFunctions,
                description: `Namespace containing ${finalName} utilities`,
              })
            }
          }
          // Also check if it's a named import that might be a namespace object
          else if (
            namedImports.has(exportName) &&
            !typeOnlyImports.has(exportName)
          ) {
            const importDecl = namedImports.get(exportName)
            const namespaceFunctions = extractNamespaceFunctions(
              sourceFile,
              exportName,
              importDecl
            )
            // Only add as namespace if it actually has functions
            if (namespaceFunctions.length > 0) {
              namespaces.push({
                name: finalName,
                functions: namespaceFunctions,
                description: `Namespace containing ${finalName} utilities`,
              })
            }
          }
        }
      })
    })

    // Get exported declarations from the current file
    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      declarations.forEach(declaration => {
        // Skip type declarations, interfaces, and type aliases
        if (
          Node.isTypeAliasDeclaration(declaration) ||
          Node.isInterfaceDeclaration(declaration) ||
          Node.isEnumDeclaration(declaration)
        ) {
          // Skip these as they are types, not functions
          return
        }

        const funcInfo = extractFunctionInfo(declaration, name, sourceFile)

        if (funcInfo) {
          functions.push(funcInfo)
        }
        // Check if this is a namespace export for variable declarations
        else if (Node.isVariableDeclaration(declaration)) {
          // Only check if this is a namespace export if it's an actual namespace import
          // and it's not a type-only import
          if (
            actualNamespaceImports.has(name) &&
            !typeOnlyImports.has(name) &&
            !namespaces.some(ns => ns.name === name)
          ) {
            const importDecl = actualNamespaceImports.get(name)
            const namespaceFunctions = extractNamespaceFunctions(
              sourceFile,
              name,
              importDecl
            )
            // Only add as namespace if it actually has functions
            if (namespaceFunctions.length > 0) {
              const jsDocInfo = parseJsDoc(declaration)
              namespaces.push({
                name,
                functions: namespaceFunctions,
                description:
                  jsDocInfo.description ||
                  `Namespace containing ${name} utilities`,
              })
            }
          }
          // Also check if it's a named import that might be a namespace object
          else if (
            namedImports.has(name) &&
            !typeOnlyImports.has(name) &&
            !namespaces.some(ns => ns.name === name)
          ) {
            const importDecl = namedImports.get(name)
            const namespaceFunctions = extractNamespaceFunctions(
              sourceFile,
              name,
              importDecl
            )
            // Only add as namespace if it actually has functions
            if (namespaceFunctions.length > 0) {
              const jsDocInfo = parseJsDoc(declaration)
              namespaces.push({
                name,
                functions: namespaceFunctions,
                description:
                  jsDocInfo.description ||
                  `Namespace containing ${name} utilities`,
              })
            }
          }
        }
      })
    })
  } catch (e) {
    console.warn(`Error extracting exports from entry file: ${e.message}`)
    console.warn(e.stack)
  }

  return {functions, namespaces}
}

module.exports = {
  extractExportsFromEntryFile,
}
