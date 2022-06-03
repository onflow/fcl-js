const _ = require("lodash")

const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")
const sourcemap = require("rollup-plugin-sourcemaps")
const nodePolyfills = require("rollup-plugin-polyfill-node")
const {nodeResolve} = require("@rollup/plugin-node-resolve")

module.exports = function getInputOptions(package, build) {
  let options = {
    input: build.source,
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

  return options
}
