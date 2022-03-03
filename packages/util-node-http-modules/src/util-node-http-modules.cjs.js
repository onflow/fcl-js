module.exports = {
  async getNodeHttpModules() {
    let nodeHttpsTransport
    try {
      nodeHttpsTransport = require("https")
    } catch (e) {}
    let nodeHttpTransport
    try {
      nodeHttpTransport = require("http")
    } catch (e) {}

    return {
      nodeHttpsTransport,
      nodeHttpTransport
    }
  } 
}
