const fs = require("fs")

function generatePage(templates, templateName, outputPath, context) {
  try {
    const content = templates[templateName](context)
    fs.writeFileSync(outputPath, content)
  } catch (error) {
    console.error(`Error generating ${templateName} page: ${error.message}`)
    throw error
  }
}

module.exports = {generatePage}
