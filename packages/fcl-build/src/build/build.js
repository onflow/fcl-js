const {rollup} = require("rollup")
const {existsSync, mkdirSync} = require("fs")

const getInputOptions = require("./build-input-options")
const getOutputOptions = require("./build-output-options")

const {merge} = require("lodash")

module.exports = async (build, package) => {
  const inputOptions = getInputOptions(package, build)

  let bundle, buildError
  try {
    bundle = await rollup(inputOptions)
    await generateOutput(bundle, build, package)
  } catch (error) {
    throw error
    buildError = error
  } finally {
    if (bundle) {
      await bundle.close()
    }
  }

  if (buildError) {
    throw new Error(buildError)
  }
}

async function generateOutput(bundle, build, package) {
  if (!existsSync(build.dir)) mkdirSync(build.dir)

  const outputOptions = getOutputOptions(package, build)
  const {output} = await bundle.write(outputOptions)
}
