const fs = require("fs")

function parseConfigCustomData(configPath) {
  // Parse config custom data if present and return custom one or null for default
  const config = fs.existsSync(configPath) ? require(configPath) : null
  return {
    displayName: config?.customData?.displayName || null,
    sections: {
      overview: config?.customData?.sections?.overview || null,
      requirements: config?.customData?.sections?.requirements || null,
      importing: config?.customData?.sections?.importing || null,
    },
    extra: config?.customData?.extra || null,
  }
}

module.exports = {parseConfigCustomData}
