const tailwindcss = require("tailwindcss")
const tailwindConfig = require("./tailwind.config.js")
const autoprefixer = require("autoprefixer")

module.exports = {
  plugins: [tailwindcss(tailwindConfig), autoprefixer],
}
