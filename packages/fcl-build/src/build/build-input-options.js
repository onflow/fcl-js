const _ = require("lodash")

const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")
const sourcemap = require("rollup-plugin-sourcemaps")
const {nodeResolve} = require("@rollup/plugin-node-resolve")

module.exports = function getInputOptions(package, build) {
  let options = {
    input: build.source,
  }

  switch (build.type) {
    case "cjs":
      return _.merge(options, {
        plugins: [
          sourcemap(),
          nodeResolve({
            browser: true,
            preferBuiltins: true,
          }),
          commonjs(),
          replace({
            preventAssignment: true,
            PACKAGE_CURRENT_VERSION: JSON.stringify(package.version),
          }),
        ],
      })
    case "esm":
      return _.merge(options, {
        plugins: [
          sourcemap(),
          nodeResolve({
            browser: true,
            preferBuiltins: true,
          }),
          commonjs(),
          replace({
            preventAssignment: true,
            PACKAGE_CURRENT_VERSION: JSON.stringify(package.version),
          }),
        ],
      })
    case "umd":
      return _.merge(options, {
        plugins: [
          sourcemap(),
          nodeResolve({
            browser: true,
            preferBuiltins: false,
          }),
          commonjs(),
          replace({
            preventAssignment: true,
            PACKAGE_CURRENT_VERSION: JSON.stringify(package.version),
          }),
        ],
      })
  }

  return options
}
