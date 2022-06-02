const {program} = require("commander")
const buildModule = require("./build")
const assert = require("assert")

module.exports = packageConfig => package => {
  program
    .name("FCL Build Tool")
    .description("Zero-configuration CLI to build FCL packages")
    .version("1.0.0")

  let commandLineConfig = {} // TODO populate using command line

  const config = {
    ...packageConfig,
    ...commandLineConfig,
  }

  program.action(async () => {
    console.log(`Building ${package.name}...`)

    assert(
      config.builds,
      "Module entry point(s) (package.build) must be defined"
    )
    await Promise.all(config.builds.map(build => buildModule(build, package)))

    console.log("Build Success!")
  })

  program.parse()
}
