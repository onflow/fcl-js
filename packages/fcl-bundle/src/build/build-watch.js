const WatcherPool = require("./watcher-pool")
const {watch} = require("rollup")

const getInputOptions = require("./get-input-options")
const getOutputOptions = require("./get-output-options")

module.exports = async function buildModulesWatch(builds, package) {
  const watcherOptionsList = builds.map(build =>
    getWatcherOptions(build, package)
  )
  const watcherPool = new WatcherPool(watcherOptionsList)
  watcherPool.on("event", handleWatcherEvent)

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
        console.log("Done!")
        break
    }
  }
}

function getWatcherOptions(build, package) {
  const inputOptions = getInputOptions(package, build)
  const outputOptions = getOutputOptions(package, build)
  const watcherOptions = {
    ...inputOptions,
    output: [outputOptions],
  }

  return watcherOptions
}
