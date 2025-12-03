// Jest transform for .json files - returns parsed JSON
const fs = require("fs")

module.exports = {
  process(sourceText, sourcePath) {
    return {
      code: `module.exports = ${sourceText};`,
    }
  },
}
