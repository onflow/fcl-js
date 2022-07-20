const {rollup} = require("rollup")

const getInputOptions = require("./get-input-options")
const getOutputOptions = require("./get-output-options")

module.exports = async function buildModules(builds, package) {
  console.log(`Building ${package.name}...`)
  await Promise.all(builds.map(build => buildModule(build, package)))
  console.log("Build Success!")
}

async function buildModule(build, package) {
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
