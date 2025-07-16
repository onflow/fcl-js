import {getServices} from "./services"
import {config} from "@onflow/config"
import * as chainIdModule from "../utils/chain-id/get-chain-id"
import {createMockContext} from "../test-utils/mock-context"

const serviceOne = {
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authn",
  method: "IFRAME/RPC",
  uid: "walletone#authn",
  endpoint: "https://test.test",
  provider: {
    address: "0x1",
    name: "Wallet One",
  },
}

const serviceTwo = {
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authz",
  method: "IFRAME/RPC",
  uid: "wallettwo#authn",
  endpoint: "https://test.test",
  provider: {
    address: "0x2",
    name: "Wallet Two",
  },
}

const serviceThree = {
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authn",
  method: "IFRAME/RPC",
  uid: "walletthree#authn",
  endpoint: "https://test.test",
  provider: {
    address: "0x3",
    name: "Wallet Three",
  },
}

const serviceFour = {
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authn",
  method: "IFRAME/RPC",
  uid: "walletfour#authn",
  endpoint: "https://test.test",
  optIn: true,
  provider: {
    address: "0x4",
    name: "Wallet Four",
  },
}

const endpoint = "https://fcl-discovery.onflow.org/api/testnet/authn"

describe("getServices", () => {
  let windowSpy
  let chainIdSpy
  let configRef
  let mockContext: ReturnType<typeof createMockContext>

  beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get")
    chainIdSpy = jest.spyOn(chainIdModule, "getChainId")
    chainIdSpy.mockImplementation(async () => "testnet")
    mockContext = createMockContext({
      configValues: {
        "discovery.authn.endpoint": endpoint,
        "accessNode.api": "https://rest-testnet.onflow.org",
      },
    })
  })

  afterEach(() => {
    windowSpy.mockRestore()
    chainIdSpy.mockRestore()
  })

  it("it should get only services of type authn", async () => {
    const mockData = [serviceOne, serviceTwo]

    windowSpy.mockImplementation(() => ({
      fcl_extensions: [serviceThree],
    }))

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    ) as jest.Mock

    const response = await getServices({types: ["authn"], context: mockContext})
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
