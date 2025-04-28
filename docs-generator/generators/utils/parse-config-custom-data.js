const fs = require("fs")

function parseConfigCustomData(configPath) {
  const config = fs.existsSync(configPath) ? require(configPath) : null
  const content = {
    packageIndex: {
      overview: null,
    },
    installation: {
      requirements: null,
      importing: null,
      extra: null,
    },
  }

  if (config && config.customData) {
    content.packageIndex.overview =
      config.customData.packageIndex.overview || null
    content.installation.requirements =
      config.customData.installation.requirements || null
    content.installation.importing =
      config.customData.installation.importing || null
    content.installation.extra = config.customData.installation.extra || null
  }
  return content
}

module.exports = {parseConfigCustomData}
