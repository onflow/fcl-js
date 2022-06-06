const {rollup} = require("rollup")

const getInputOptions = require("./build-input-options")
const getOutputOptions = require("./build-output-options")

module.exports = async (build, package) => {
  const inputOptions = getInputOptions(package, build)

  let bundle, buildError
  try {
    bundle = await rollup(inputOptions)
    await generateOutput(bundle, build, package)
  } catch (error) {
    buildError = error
  }
  if (bundle) await bundle.close()

  if (buildError) {
    throw new Error(buildError)
  }
}

async function generateOutput(bundle, build, package) {
  const outputOptions = getOutputOptions(package, build)
  const {output} = await bundle.write(outputOptions)
}
