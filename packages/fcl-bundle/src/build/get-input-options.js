const _ = require("lodash")

const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")
const {nodeResolve} = require("@rollup/plugin-node-resolve")
const {babel} = require("@rollup/plugin-babel")
const terser = require("@rollup/plugin-terser")
const typescript = require("rollup-plugin-typescript2")
const {DEFAULT_EXTENSIONS} = require("@babel/core")

const builtinModules = require("builtin-modules")

const SUPPRESSED_WARNING_CODES = [
  "MISSING_GLOBAL_NAME",
  "MISSING_NODE_BUILTINS",
  "EVAL",
]

module.exports = function getInputOptions(package, build) {
  // ensure that that package has the required dependencies
  if (!package.dependencies["@babel/runtime"]) {
    throw new Error(
      `${package.name} is missing required @babel/runtime dependency.  Please add this to the package.json and try again.`
    )
  }

  // determine if we are building typescript
  const source = build.source
  const isTypeScript = source.endsWith(".ts")

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
  const resolveOnly = [
    new RegExp(
      `^(?!${Object.keys(package.peerDependencies || {}).join("|")}).*`
    ),
  ]

  const extensions = DEFAULT_EXTENSIONS.concat([".ts", ".tsx", ".mts", ".cts"])

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
        resolveOnly,
        extensions,
      }),
      commonjs(),
      isTypeScript &&
        typescript({
          clean: true,
          include: [
            "*.ts+(|x)",
            "**/*.ts+(|x)",
            "**/*.cts",
            "**/*.mts",
            "*.js+(|x)",
            "**/*.js+(|x)",
            "**/*.cjs",
            "**/*.mjs",
          ],
          tsconfigDefaults: {
            compilerOptions: {
              // patch for rollup-plugin-typescript2 because rootDirs
              // are used to resolve include/exclude filters
              rootDirs: [""],
            },
          },
          useTsconfigDeclarationDir: true,
        }),
      replace({
        preventAssignment: true,
        PACKAGE_CURRENT_VERSION: JSON.stringify(package.version),
      }),
      babel({
        babelHelpers: "runtime",
        presets: ["@babel/preset-env", "@babel/preset-typescript"],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              version: babelRuntimeVersion,
            },
          ],
        ],
        sourceMaps: true,
        extensions,
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
