const {parseJsDoc} = require("./jsdoc-parser")
const {cleanupTypeText, escapeParameterNameForMDX} = require("./type-utils")
const {
  extractFunctionInfo,
  findFunctionInSourceFile,
  resolveReExportedFunction,
} = require("./function-extractor")
const {extractNamespaceFunctions} = require("./namespace-utils")
const {discoverWorkspacePackages} = require("./file-utils")
const {extractExportsFromEntryFile} = require("./export-extractor")

module.exports = {
  parseJsDoc,
  cleanupTypeText,
  escapeParameterNameForMDX,
  extractFunctionInfo,
  findFunctionInSourceFile,
  resolveReExportedFunction,
  extractNamespaceFunctions,
  discoverWorkspacePackages,
  extractExportsFromEntryFile,
}
