// Jest transform for .json files - returns parsed JSON

module.exports = {
  process(sourceText, sourcePath) {
    return {
      code: `module.exports = ${sourceText};`,
    }
  },
}
