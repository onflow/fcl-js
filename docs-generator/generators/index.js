const {generatePackageIndexPage} = require("./generate-package-index-page")
const {generateInstallationPage} = require("./generate-installation-page")
const {generateReferenceIndexPage} = require("./generate-reference-index-page")
const {generateFunctionPage} = require("./generate-function-page")
const {
  generatePackageListIndexPage,
} = require("./generate-package-list-index-page")
const {generateTypesIndexPage} = require("./generate-types-index-page")

module.exports = {
  generatePackageIndexPage,
  generateInstallationPage,
  generateReferenceIndexPage,
  generateFunctionPage,
  generatePackageListIndexPage,
  generateTypesIndexPage,
}
