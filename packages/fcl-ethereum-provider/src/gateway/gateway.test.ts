import HttpConnection from "@walletconnect/jsonrpc-http-connection"
import {Gateway} from "./gateway"
import * as fcl from "@onflow/fcl"
import {JsonRpcProvider} from "@walletconnect/jsonrpc-provider"

jest.mock("@walletconnect/jsonrpc-http-connection")
jest.mock("@walletconnect/jsonrpc-provider")
jest.mock("@onflow/fcl", () => ({
  getChainId: jest.fn(),
}))

describe("gateway", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("request should work for mainnet", async () => {
    const gateway = new Gateway({
      747: "https://example.com",
      646: "https://example.com/testnet",
    })

    jest.mocked(fcl.getChainId).mockResolvedValue("mainnet")
    jest.mocked(JsonRpcProvider).mockImplementation(
      jest.fn(
        () =>
          ({
            request: jest.fn().mockResolvedValue(["0x123"]),
          }) as any as JsonRpcProvider
      )
    )

    const returnValue = await gateway.request({
      method: "eth_accounts",
      params: [],
    })

    // Check that the arguments are correct
    expect(
      jest.mocked(JsonRpcProvider).mock.results[0].value.request
    ).toHaveBeenCalledWith({method: "eth_accounts", params: []})

    // Check that the return value propogates correctly
    expect(returnValue).toEqual(["0x123"])

    // Verify that the mainnet provider was used
    expect(JsonRpcProvider).toHaveBeenCalled()
    expect(JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(JsonRpcProvider).toHaveBeenCalledWith(
      jest.mocked(HttpConnection).mock.instances[0]
    )
    expect(HttpConnection).toHaveBeenCalledWith("https://example.com")
  })

  test("request should work for testnet", async () => {
    const gateway = new Gateway({
      747: "https://example.com",
      646: "https://example.com/testnet",
    })

    jest.mocked(fcl.getChainId).mockResolvedValue("testnet")
    jest.mocked(JsonRpcProvider).mockImplementation(
      jest.fn(
        () =>
          ({
            request: jest.fn().mockResolvedValue(["0x123"]),
          }) as any as JsonRpcProvider
      )
    )

    const returnValue = await gateway.request({
      method: "eth_accounts",
      params: [],
    })

    // Check that the arguments are correct
    expect(
      jest.mocked(JsonRpcProvider).mock.results[0].value.request
    ).toHaveBeenCalledWith({method: "eth_accounts", params: []})

    // Check that the return value propogates correctly
    expect(returnValue).toEqual(["0x123"])

    // Verify that the testnet provider was used
    expect(JsonRpcProvider).toHaveBeenCalled()
    expect(JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(JsonRpcProvider).toHaveBeenCalledWith(
      jest.mocked(HttpConnection).mock.instances[0]
    )
    expect(HttpConnection).toHaveBeenCalledWith("https://example.com/testnet")
  })

  test("subsequent requests should use the same provider", async () => {
    const gateway = new Gateway({
      747: "https://example.com",
      646: "https://example.com/testnet",
    })

    jest.mocked(fcl.getChainId).mockResolvedValue("testnet")
    jest.mocked(JsonRpcProvider).mockImplementation(
      jest.fn(
        () =>
          ({
            request: jest.fn().mockResolvedValue(["0x123"]),
          }) as any as JsonRpcProvider
      )
    )

    await gateway.request({
      method: "eth_accounts",
      params: [],
    })

    await gateway.request({
      method: "eth_accounts",
      params: [],
    })

    // Verify that the testnet provider was used
    expect(JsonRpcProvider).toHaveBeenCalled()
    expect(JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(JsonRpcProvider).toHaveBeenCalledWith(
      jest.mocked(HttpConnection).mock.instances[0]
    )
    expect(HttpConnection).toHaveBeenCalledWith("https://example.com/testnet")
  })

  test("request should throw if chainId is not found", async () => {
    const gateway = new Gateway({
      747: "https://example.com",
      646: "https://example.com/testnet",
    })

    jest.mocked(fcl.getChainId).mockResolvedValue("unknown")

    await expect(
      gateway.request({
        method: "eth_accounts",
        params: [],
      })
    ).rejects.toThrow("Unsupported chainId unknown")
  })

  test("should default to public gateway mainnet", async () => {
    const gateway = new Gateway({})

    jest.mocked(fcl.getChainId).mockResolvedValue("mainnet")
    jest.mocked(JsonRpcProvider).mockImplementation(
      jest.fn(
        () =>
          ({
            request: jest.fn().mockResolvedValue(["0x123"]),
          }) as any as JsonRpcProvider
      )
    )

    await gateway.request({
      method: "eth_accounts",
      params: [],
    })

    // Verify that the mainnet provider was used
    expect(JsonRpcProvider).toHaveBeenCalled()
    expect(JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(JsonRpcProvider).toHaveBeenCalledWith(
      jest.mocked(HttpConnection).mock.instances[0]
    )
    expect(HttpConnection).toHaveBeenCalledWith(
      "https://access.mainnet.nodes.onflow.org"
    )
  })

  test("should default to public gateway testnet", async () => {
    const gateway = new Gateway({})

    jest.mocked(fcl.getChainId).mockResolvedValue("testnet")
    jest.mocked(JsonRpcProvider).mockImplementation(
      jest.fn(
        () =>
          ({
            request: jest.fn().mockResolvedValue(["0x123"]),
          }) as any as JsonRpcProvider
      )
    )

    await gateway.request({
      method: "eth_accounts",
      params: [],
    })

    // Verify that the testnet provider was used
    expect(JsonRpcProvider).toHaveBeenCalled()
    expect(JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(JsonRpcProvider).toHaveBeenCalledWith(
      jest.mocked(HttpConnection).mock.instances[0]
    )
    expect(HttpConnection).toHaveBeenCalledWith(
      "https://access.testnet.nodes.onflow.org"
    )
  })
})
