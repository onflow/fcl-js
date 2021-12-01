import {getServices} from "./services"
import {config} from "@onflow/sdk"

const serviceOne = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authn",
  "method": "IFRAME/RPC",
  "uid": "walletone#authn",
  "endpoint": "https://something.hi",
  "provider": {
    "address": "0x1",
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
    "address": "0x2",
    "name": "Wallet Two"
  }
}

const serviceThree = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authn",
  "method": "IFRAME/RPC",
  "uid": "walletthree#authn",
  "endpoint": "https://something.hi",
  "provider": {
    "address": "0x3",
    "name": "Wallet Three"
  }
}

const serviceFour = {
  "f_type": "Service",
  "f_vsn": "1.0.0",
  "type": "authn",
  "method": "IFRAME/RPC",
  "uid": "walletfour#authn",
  "endpoint": "https://something.hi",
  "optIn": true,
  "provider": {
    "address": "0x4",
    "name": "Wallet Four"
  }
}

describe("getServices", () => {
  let windowSpy
  let configRef

  beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get")
    configRef = config()
    configRef.put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/testnet/authn")
  })

  afterEach(() => {
    windowSpy.mockRestore()
    global.fetch.mockClear()
  })

  it("it should get only services of type authn", async () => {
    const mockData = [serviceOne, serviceTwo]

    windowSpy.mockImplementation(() => ({
      fcl_extensions: [serviceThree]
    }))

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData)
    }))

    const response = await getServices({ type: "authn" })
    const expectedResponse = [serviceThree, serviceOne] // returns extensions first
    expect(response.length).toEqual(2)
    expect(response).toEqual(expectedResponse)
  })

  it("it should hide optIn services if NOT set in config", async () => {
    const mockData = [serviceOne, serviceFour]

    windowSpy.mockImplementation(() => ({
      fcl_extensions: [serviceThree]
    }))

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData)
    }))

    const response = await getServices({ type: "authn" })
    const expectedResponse = [serviceThree, serviceOne]
    expect(response).toEqual(expectedResponse)
    expect(response.length).toEqual(2)
  })

  it("it should show optIn services if set in config", async () => {
    const mockData = [serviceOne, serviceFour]
    configRef.put("discovery.authn.include", ["0x4"])

    windowSpy.mockImplementation(() => ({
      fcl_extensions: [serviceThree]
    }))

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData)
    }))

    const response = await getServices({ type: "authn" })
    const expectedResponse = [serviceThree, serviceOne, serviceFour]
    expect(response).toEqual(expectedResponse)
    expect(response.length).toEqual(3)
  })
})