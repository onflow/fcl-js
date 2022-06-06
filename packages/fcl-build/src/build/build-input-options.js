const _ = require("lodash")
const {resolve} = require("path")

const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")
const sourcemap = require("rollup-plugin-sourcemaps")
const {nodeResolve} = require("@rollup/plugin-node-resolve")

const builtinModules = require("builtin-modules")

const SUPPRESSED_WARNING_CODES = [
  "MISSING_GLOBAL_NAME",
  "MISSING_NODE_BUILTINS",
  "EVAL",
]

module.exports = function getInputOptions(package, build) {
  let externals = [/node:.*/].concat(builtinModules)
  let testExternal = id =>
    externals.reduce((state, ext) => {
      return (
        state ||
        (ext instanceof RegExp && ext.test(id)) ||
        (typeof ext === "string" && ext === id)
      )
    }, false)

  let options = {
    input: build.source,
    external: testExternal,
    onwarn: function (message) {
      if (SUPPRESSED_WARNING_CODES.includes(message.code)) return
      console.warn(message.toString())
    },
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: build.type !== "umd",
      }),
      commonjs({}),
      replace({
        preventAssignment: true,
        PACKAGE_CURRENT_VERSION: JSON.stringify(package.version),
      }),
      sourcemap({
        exclude: resolve(process.cwd(), "/**/*"),
      }),
    ],
  }

  switch (build.type) {
    case "cjs":
      return _.merge(options, {})
    case "esm":
      return _.merge(options, {})
    case "umd":
      return _.merge(options, {})
  }

  console.warn("Build type was not recognized (accepted values cjs,esm,umd)")
  return options
}
