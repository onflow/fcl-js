const _ = require("lodash")

const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")
const {nodeResolve} = require("@rollup/plugin-node-resolve")
const {babel} = require("@rollup/plugin-babel")
const terser = require('@rollup/plugin-terser')

const builtinModules = require("builtin-modules")

const SUPPRESSED_WARNING_CODES = [
  "MISSING_GLOBAL_NAME",
  "MISSING_NODE_BUILTINS",
  "EVAL",
]

module.exports = function getInputOptions(package, build) {
  if (!package.dependencies["@babel/runtime"]) {
    throw new Error(
      `${package.name} is missing required @babel/runtime dependency.  Please add this to the package.json and try again.`
    )
  }

  const babelRuntimeVersion = package.dependencies["@babel/runtime"].replace(
    /^[^0-9]*/,
    ""
  )

  let external = [/node:.*/]
    .concat(builtinModules)
    .concat(Object.keys(package.peerDependencies || {}))
    .concat(Object.keys(package.dependencies || {}))

  let testExternal = id =>
    build.type !== "umd" &&
    (/@babel\/runtime/g.test(id) ||
      external.reduce((state, ext) => {
        return (
          state ||
          (ext instanceof RegExp && ext.test(id)) ||
          (typeof ext === "string" && ext === id)
        )
      }, false))

  // exclude peer dependencies
  const resolveOnly = [new RegExp(`^(?!${Object.keys(package.peerDependencies || {}).join("|")}).*`)]

  let options = {
    input: build.source,
    external: testExternal,
    onwarn: function (message) {
      if (SUPPRESSED_WARNING_CODES.includes(message.code)) return
      console.warn(message.toString())
    },
    plugins: [
      replace({
        preventAssignment: true,
        PACKAGE_CURRENT_VERSION: JSON.stringify(package.version),
      }),
      commonjs(),
      nodeResolve({
        browser: true,
        preferBuiltins: build.type !== "umd",
        resolveOnly,
      }),
      babel({
        babelHelpers: "runtime",
        presets: [["@babel/preset-env"]],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              version: babelRuntimeVersion,
            },
          ],
        ],
        sourceMaps: true,
      }),
      /\.min\.js$/.test(build.entry) &&
        terser({
          ecma: 5,
          toplevel: build.type == "cjs" || build.type == "esm",
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

  throw new Error("Build type was not recognized (accepted values cjs,esm,umd)")
}
