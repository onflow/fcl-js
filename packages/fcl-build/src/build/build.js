const {rollup} = require("rollup")

const getInputOptions = require("./build-input-options")
const getOutputOptions = require("./build-output-options")

module.exports = async (build, package) => {
  const inputOptions = getInputOptions(package, build)
  const outputOptions = getOutputOptions(package, build)

  let bundle, buildError
  try {
    bundle = await rollup(inputOptions)
    await generateOutput(bundle, outputOptions)
  } catch (error) {
    buildError = error
  }
  if (bundle) await bundle.close()

  if (buildError) {
    throw new Error(buildError)
  }
}

async function generateOutput(bundle, outputOptions) {
  const {output} = await bundle.write(outputOptions)
}
