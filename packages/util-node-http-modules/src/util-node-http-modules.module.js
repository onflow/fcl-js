export async function getNodeHttpModules() {
  let nodeHttpsTransport
  try {
    nodeHttpsTransport = await import("https").catch(e => null)
  } catch (e) {}
  let nodeHttpTransport
  try {
    nodeHttpTransport = await import("http").catch(e => null)
  } catch (e) {}

  return {
    nodeHttpsTransport,
    nodeHttpTransport
  }
}
