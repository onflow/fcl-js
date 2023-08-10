const {existsSync, readFileSync} = require("fs")
const {resolve} = require("path")
const {getPackageRoot} = require("./util")

module.exports = function getPackageJSON(cwd = getPackageRoot()) {
  const pathPackageJSON = resolve(cwd, "package.json")
  if (existsSync(pathPackageJSON)) {
    return JSON.parse(readFileSync(pathPackageJSON))
  } else {
    throw new Error("Package.json was not found!  Aborting!")
  }
}
