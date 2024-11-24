const _ = require("lodash")
const {resolve} = require("path")
const {isObject} = require("../util")
const banner = require("../plugins/banner")
const preserveDynamicImports = require("../plugins/preserve-dynamic-imports")

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
    inlineDynamicImports: true,
    sourcemap: true,
    plugins: [
      build.banner &&
        banner(
          isObject(build.banner)
            ? build.banner
            : {
                banner: build.banner,
                raw: true,
              }
        ),
      preserveDynamicImports(),
    ],
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
      return _.merge(options, {
        plugins: [...options.plugins],
      })
  }

  console.warn("Build type was not recognized (accepted values cjs,esm,umd)")
  return options
}
