const _ = require("lodash")
const {resolve} = require("path")
const builtinModules = require("builtin-modules")

module.exports = function getOutputOptions(package, build) {
  let options = {
    file: resolve(build.dir, build.entry),
    format: build.type,
    preserveModules: false,
    sourcemap: true,
    plugins: [],
  }

  switch (build.type) {
    case "cjs":
      return _.merge(options, {
        plugins: [...options.plugins],
      })
    case "esm":
      return _.merge(options, {
        plugins: [...options.plugins],
      })
    case "umd":
      const generateUMDName = pkgName =>
        pkgName
          .replace("@", "")
          .replace("/", "-")
          .replace(/-([A-Za-z0-9])/, s => s.toUpperCase().substr(1))

      return _.merge(options, {
        name: generateUMDName(package.name),
        plugins: [...options.plugins],
      })
  }

  console.warn("Build type was not recognized (accepted values cjs,esm,umd)")
  return options
}
