export async function getNodeHttpModules() {
  let nodeHttpsTransport = null
  let nodeHttpTransport = null

  if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // bypass webpack's lazy missing modules check using variables
    // browser should never reach this scope anyways so webpack should not be checking whether these modules exist
    const httpsModule = "https"
    const httpModule = "http"

    nodeHttpsTransport = await import(httpsModule).catch(e => null)
    nodeHttpTransport = await import(httpModule).catch(e => null)
  }

  return {
    nodeHttpsTransport,
    nodeHttpTransport,
  }
}
