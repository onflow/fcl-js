const fs = require("fs")

function parseConfigCustomData(configPath) {
  // Parse config custom data if present and return custom one or null for default
  const config = fs.existsSync(configPath) ? require(configPath) : null
  return {
    displayName: config?.customData?.displayName || null,
    packageIndex: {
      overview: config?.customData?.packageIndex?.overview || null,
    },
    installation: {
      requirements: config?.customData?.installation?.requirements || null,
      importing: config?.customData?.installation?.importing || null,
      extra: config?.customData?.installation?.extra || null,
    },
  }
}

module.exports = {parseConfigCustomData}
