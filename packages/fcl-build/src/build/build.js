const {rollup} = require("rollup")

const getInputOptions = require("./build-input-options")
const getOutputOptions = require("./build-output-options")

module.exports = async function buildModules(builds, package) {
  console.log(`Building ${package.name}...`)
  await Promise.all(builds.map(build => buildModule(build, package)))
  console.log("Build Success!")
}

async function buildModule(build, package) {
  const inputOptions = getInputOptions(package, build)
  const outputOptionsList = getOutputOptions(package, build)

  let bundle, buildError
  try {
    bundle = await rollup(inputOptions)
    await generateOutput(bundle, outputOptionsList)
  } catch (error) {
    buildError = error
  }
  if (bundle) await bundle.close()

  if (buildError) {
    throw new Error(buildError)
  }
}

async function generateOutput(bundle, outputOptionsList) {
  for (const outputOption of outputOptionsList) {
    const {output} = await bundle.write(outputOption)
  }
}
