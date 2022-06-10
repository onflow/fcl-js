const _ = require("lodash")
const {resolve} = require("path")
const {getBabelOutputPlugin} = require("@rollup/plugin-babel")

const generateModuleName = pkgName =>
  pkgName
    .replace("@", "")
    .replace("/", "-")
    .replace(/-([A-Za-z0-9])/, s => s.toUpperCase().substr(1))

module.exports = function getOutputOptions(package, build) {
  let options = {
    name: generateModuleName(package.name),
    file: resolve(build.dir, build.entry),
    format: build.type,
    preserveModules: false,
    sourcemap: true,
    plugins: [],
  }

  switch (build.type) {
    case "cjs":
      return _.merge(options, {
        plugins: [
          ...options.plugins,
          getBabelOutputPlugin({
            presets: [["@babel/preset-env", {modules: "commonjs"}]],
            plugins: [["@babel/plugin-transform-runtime"]],
            sourceMaps: true,
          }),
        ],
      })
    case "esm":
      return _.merge(options, {
        plugins: [
          ...options.plugins,
          getBabelOutputPlugin({
            presets: [["@babel/preset-env", {modules: false}]],
            plugins: [["@babel/plugin-transform-runtime"]],
            sourceMaps: true,
          }),
        ],
      })
    case "umd":
      return _.merge(options, {
        plugins: [...options.plugins],
      })
  }

  console.warn("Build type was not recognized (accepted values cjs,esm,umd)")
  return options
}
