const tailwindcss = require("tailwindcss")
const tailwindConfig = require("./tailwind.config.js")
const autoprefixer = require("autoprefixer")
const prefixwrap = require("postcss-prefixwrap")

module.exports = {
  plugins: [
    tailwindcss(tailwindConfig),
    autoprefixer,
    prefixwrap(".flow-wrapper"),
  ],
}
