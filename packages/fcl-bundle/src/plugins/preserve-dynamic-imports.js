module.exports = function preserveDynamicImports() {
  return {
    name: "preserve-dynamic-imports",
    renderDynamicImport() {
      return {
        left: "import(",
        right: ")",
      }
    },
  }
}
