const {program} = require("commander")
const buildModule = require("./build")

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

  program.action(async (_, options) => {
    console.log(`Building ${package.name}...`)
    await Promise.all(config.builds.map(build => buildModule(build, package)))
    console.log("Build Success!")
  })

  program.parse()
}
