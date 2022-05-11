import { getNodeHttpModules } from './util-node-http-modules'

test("HTTP Transports exist", async () => {
    const { nodeHttpsTransport, nodeHttpTransport } = await getNodeHttpModules()
    expect(nodeHttpTransport | nodeHttpsTransport).toBeDefined()
})