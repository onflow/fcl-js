const {watch} = require("rollup")

const getInputOptions = require("./build-input-options")
const getOutputOptions = require("./build-output-options")

module.exports = async (build, package) => {
  const inputOptions = getInputOptions(package, build)
  const outputOptions = getOutputOptions(package, build)
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
  }

  let watcher, buildError
  try {
    watcher = await watch(watchOptions)
    watcher.on("event", event => {
      switch (event.code) {
        case "START":
          break
        case "BUNDLE_START":
          break
        case "BUNDLE_END":
          break
        case "END":
          break
        case "ERROR":
          break
      }
    })
  } catch (error) {
    buildError = error
  }

  if (watcher) watcher.close()

  if (buildError) {
    throw new Error(buildError)
  }
}
