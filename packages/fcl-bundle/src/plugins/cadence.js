/**
 * Rollup plugin to import .cdc (Cadence) files as raw strings
 */
module.exports = function cadence() {
  return {
    name: "cadence",
    transform(code, id) {
      if (!id.endsWith(".cdc")) return null

      return {
        code: `export default ${JSON.stringify(code)};`,
        map: null,
      }
    },
  }
}
