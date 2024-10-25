const {createFilter} = require("@rollup/pluginutils")

module.exports = function rawPlugin() {
  const filter = createFilter(["**/*?raw"]) // Match files ending with ?raw

  const rawList = []
  return {
    name: "raw-suffix-plugin",

    // Use `resolveId` to handle the ?raw suffix
    resolveId(source, importer) {
      if (filter(source)) {
        // Strip ?raw, and let other plugins (like node-resolve) handle the resolution
        const actualSource = source.replace("?raw", "")
        return this.resolve(actualSource, importer, {skipSelf: true}).then(
          resolved => {
            // Append ?raw back after resolution
            if (resolved) {
              rawList.push(resolved.id)
              return `${resolved.id}`
            }
            return null
          }
        )
      }
      return null // Allow other plugins to resolve other files
    },
    transform(code, id) {
      // Only transform files that match the filter
      if (!rawList.includes(id)) return null

      // Return the raw code directly as a JavaScript object
      return {
        code: `export default ${JSON.stringify(code)}`,
        map: {mappings: ""},
      }
    },
  }
}
