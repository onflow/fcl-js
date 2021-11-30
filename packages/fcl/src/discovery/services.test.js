import {getServices} from "./services"
import {config} from "@onflow/sdk"

const serviceOne = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authn",
  "method": "IFRAME/RPC",
  "uid": "walletone#authn",
  "endpoint": "https://something.hi",
  "platform": "web/mobile",
  "provider": {
    "name": "Wallet One"
  }
}

const serviceTwo = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authz",
  "method": "IFRAME/RPC",
  "uid": "wallettwo#authn",
  "endpoint": "https://something.hello",
  "provider": {
    "name": "Wallet Two"
  }
}

const serviceExtensionOne = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authn",
  "method": "IFRAME/RPC",
  "uid": "walletthree#authn",
  "endpoint": "https://something.hi",
  "platform": "web/extension",
  "provider": {
    "name": "Wallet Three"
  }
}

const serviceExtensionTwo = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authn",
  "method": "IFRAME/RPC",
  "uid": "walletfour#authn",
  "endpoint": "https://something.hi",
  "platform": "web/extension",
  "provider": {
    "name": "Wallet Four"
  }
}

describe("getServices", () => {
  let windowSpy;

  beforeAll(() => {
    config()
      .put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/testnet/authn")
  })

  beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get")
  })

  afterEach(() => {
    windowSpy.mockRestore()
    global.fetch.mockClear()
  })

  it("it should get only services of type authn", async () => {
    const mockData = [serviceOne, serviceTwo]

    windowSpy.mockImplementation(() => ({
      fcl_extensions: []
    }))

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData)
    }))

    const response = await getServices({ type: "authn" })
    const expectedResponse = [serviceOne]
    expect(response).toEqual(expectedResponse)
  })

  it("it should only show extensions on the discovery list and if they are injected", async () => {
    const mockData = [serviceOne, serviceExtensionOne, serviceExtensionTwo]

    windowSpy.mockImplementation(() => ({
      fcl_extensions: [serviceExtensionOne]
    }))

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData)
    }))

    const response = await getServices({ type: "authn" })
    const expectedResponse = [serviceOne, serviceExtensionOne]
    expect(response).toEqual(expectedResponse)
    expect(response.length).toEqual(2)
  })
})
