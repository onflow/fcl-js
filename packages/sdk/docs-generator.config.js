const fs = require("fs")
const path = require("path")

module.exports = {
  customData: {
    extra: fs
      .readFileSync(path.join(__dirname, "docs", "extra.md"), "utf8")
      .trim(),
  },
}
