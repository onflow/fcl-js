const WatcherFactory = require("./build-watcher-factory")

const getInputOptions = require("./build-input-options")
const getOutputOptions = require("./build-output-options")

module.exports = async function buildModulesWatch(builds, package) {
  const watcherFactory = new WatcherFactory(builds.length)
  watcherFactory.eventEmitter.on("event", handleWatcherEvent)

  await Promise.all(
    builds.map(build => buildModuleWatch(build, package, watcherFactory))
  )

  function handleWatcherEvent(event) {
    switch (event.code) {
      case "START":
        console.log(`Building ${package.name}...`)
        break
      case "BUNDLE_START":
        break
      case "BUNDLE_END":
        break
      case "END":
        console.log("Build Success!")
        break
      case "ERROR":
        console.error("Build failed!")
        break
    }
  }
}

async function buildModuleWatch(build, package, watcherFactory) {
  const inputOptions = getInputOptions(package, build)
  const outputOptions = getOutputOptions(package, build)
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
  }

  let watcher, buildError
  try {
    watcher = watcherFactory.makeWatcher(watchOptions)
  } catch (error) {
    buildError = error
  }

  if (watcher) watcher.close()

  if (buildError) {
    throw new Error(buildError)
  }
}
