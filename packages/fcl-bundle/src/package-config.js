const assert = require("assert")
const {resolve, dirname, basename, join} = require("path")
const {isArray, isObject, isString, getPackageRoot} = require("./util")
const {existsSync, mkdirSync} = require("fs")

function determineBuildPaths(package, outputs, entryName) {
  const buildTypeMap = {
    main: "cjs",
    module: "esm",
    unpkg: "umd",
  }

  const packageOutputs = Object.keys(package).reduce((outputs, key) => {
    if (Object.keys(buildTypeMap).includes(key)) {
      outputs[buildTypeMap[key]] = package[key]
    }
    return outputs
  }, {})

  const unsupportedOutput = Object.keys(outputs).find(
    type => !Object.values(buildTypeMap).includes(type)
  )
  if (unsupportedOutput) {
    throw new Error(
      `An unsupported output format "${unsupportedOutput}" was provided - supported types are ${Object.values(
        buildTypeMap
      ).join(", ")}`
    )
  }

  outputs = {
    ...packageOutputs,
    ...outputs,
  }

  if (!outputs) {
    console.warn(
      `No outputs were specified in building ${entryName} from ${package.name}, using defaults for cjs,esm,umd ...`
    )
    outputs = {
      cjs: `/dist/${entryName}.js`,
      esm: `/dist/${entryName}.module.js`,
      umd: `/dist/${entryName}.umd.js`,
    }
  }

  assert(
    !Object.keys(outputs).find(x =>
      Object.keys(outputs).find(y => outputs[x] == outputs[y] && x != y)
    ),
    "Cannot have duplicate output paths!"
  )

  return Object.keys(outputs).map(type => ({
    type,
    dir: resolve(join(getPackageRoot(), dirname(outputs[type]))),
    entry: basename(outputs[type]),
  }))
}

module.exports = package => {
  let builds = package.source

  assert(
    builds,
    'The "source" root level configuration property must be specified'
  )

  if (isObject(builds)) {
    builds = Object.keys(builds).map(key => ({
      source: key,
      ...builds[key],
    }))
  } else if (isArray(builds)) {
    assert(
      !builds.find(x => !isString(x)),
      "Source files must be provided as strings"
    )
  } else {
    builds = [builds]
  }

  const cfg = {
    builds: builds.reduce((buildConfigs, build) => {
      let source, banner
      let outputs = {}

      if (isObject(build)) {
        source = build.source
        banner = build.banner
        outputs = {
          cjs: build.cjs,
          esm: build.esm,
          umd: build.umd,
        }

        // Filter out missing outputs
        outputs = Object.keys(outputs).reduce((acc, key) => {
          if (outputs[key]) acc[key] = outputs[key]
          return acc
        }, {})
      } else {
        source = build
      }
      let entryName = basename(source)

      buildConfigs.push(
        ...determineBuildPaths(package, outputs, entryName).map(build => ({
          ...build,
          source,
          banner,
        }))
      )
      return buildConfigs
    }, []),
  }

  cfg.builds.forEach(build =>
    !existsSync(build.dir) ? mkdirSync(build.dir) : null
  )

  return cfg
}
