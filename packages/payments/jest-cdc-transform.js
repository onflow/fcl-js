// Jest transform for .cdc files - returns content as string
module.exports = {
  process(sourceText) {
    return {
      code: `module.exports = ${JSON.stringify(sourceText)};`,
    }
  },
}
