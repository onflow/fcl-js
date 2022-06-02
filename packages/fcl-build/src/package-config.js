const assert = require("assert")
const {resolve, relative, dirname, basename, extname, join} = require("path")
const {isString, isArray, isObject} = require("./util")

function determineBuildPaths(rawPaths, entryName) {
  const defaultOutputDirs = {
    main: "/lib/",
    module: "/lib.esm/",
    unpkg: "/lib.umd/",
  }

  const buildTypeMap = {
    main: "cjs",
    module: "esm",
    unpkg: "umd",
  }

  const paths = Object.keys(rawPaths)
    .filter(pathKey => Object.keys(defaultOutputDirs).find(x => x == pathKey))
    .reduce((paths, pathKey) => ({...paths, [pathKey]: rawPaths[pathKey]}), {})

  console.log(paths)

  assert(
    !Object.keys(paths).find(x =>
      Object.keys(paths).find(y => paths[x] == paths[y] && x != y)
    ),
    "Cannot have duplicate output paths!"
  )

  return Object.keys(defaultOutputDirs).map(key => ({
    type: buildTypeMap[key],
    dir: resolve(
      join(
        process.cwd(),
        paths[key] ? dirname(paths[key]) : defaultOutputDirs[key]
      )
    ),
    entry: basename(paths[key] || entryName),
  }))
}

module.exports = package => {
  let builds = package.build || package.builds

  assert(builds, "Module entry point(s) (package.build) must be defined")

  if (isObject(builds)) {
    builds = Object.keys(builds).map(key => ({
      entry: key,
      ...builds[key],
    }))
  } else if (!isArray(builds)) {
    builds = [builds]
  }

  return {
    builds: builds.reduce((buildConfigs, build) => {
      let entry
      let buildPaths = {}
      if (isObject(build)) {
        ;({entry, ...buildPaths} = build)
      } else {
        entry = build
      }
      let entryName = basename(entry)

      buildConfigs.push(
        ...determineBuildPaths({...package, ...buildPaths}, entryName).map(
          buildPath => ({
            ...buildPath,
            source: entry,
          })
        )
      )
      return buildConfigs
    }, []),
  }
}
