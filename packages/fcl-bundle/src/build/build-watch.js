const WatcherPool = require("./watcher-pool")
const {watch} = require("rollup")

const getInputOptions = require("./get-input-options")
const getOutputOptions = require("./get-output-options")

module.exports = async function buildModulesWatch(builds, pkg) {
  const watcherOptionsList = builds.map(build =>
    getWatcherOptions(build, pkg)
  )
  const watcherPool = new WatcherPool(watcherOptionsList)
  watcherPool.on("event", handleWatcherEvent)

  function handleWatcherEvent(event) {
    switch (event.code) {
      case "START":
        console.log(`Building ${pkg.name}...`)
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

function getWatcherOptions(build, pkg) {
  const inputOptions = getInputOptions(pkg, build)
  const outputOptions = getOutputOptions(pkg, build)
  const watcherOptions = {
    ...inputOptions,
    output: [outputOptions],
  }

  return watcherOptions
}
