module.exports = function banner({banner, raw}) {
  return {
    name: "banner",
    outputOptions(options) {
      if (!raw) {
        banner = [
          "/**",
          ...banner.split(/\r?\n/).map(l => ` * ${l}`),
          "*/",
        ].reduce((acc, l) => (acc += `${l}\n`), "")
      }
      return {
        ...options,
        banner,
      }
    },
  }
}
