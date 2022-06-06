const {program} = require("commander")
const buildModule = require("./build/build")
const watchModule = require("./build/build-watch")
const assert = require("assert")

module.exports = packageConfig => package => {
  program
    .name("FCL Build Tool")
    .description("Zero-configuration CLI to build FCL packages")
    .version("1.0.0")
    .option("-w, --watch", "Run the build in watch-mode")
    .parse()

  let commandLineConfig = {} // TODO populate using command line

  const config = {
    ...packageConfig,
    ...commandLineConfig,
  }

  program.action(async () => {
    assert(
      config.builds,
      "Module entry point(s) (package.build) must be defined"
    )

    const buildAction = program.getOptionValue("watch")
      ? watchModule
      : buildModule

    await buildAction(config.builds, package)
  })

  program.parse()
}
