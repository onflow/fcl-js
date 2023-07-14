import {getChainId, clearChainIdCache} from "./get-chain-id"
import {config} from "@onflow/config"
import * as fetchChainIdModule from "./fetch-chain-id"

describe("getChainId", () => {
  afterEach(() => {
    jest.restoreAllMocks()

    // Reset chainId cache
    clearChainIdCache()
  })

  it("getChainId caches consecutive requests", async () => {
    await config.overload(
      {"accessNode.api": "https://example.com"},
      async () => {
        const fetchChainIdSpy = jest.spyOn(fetchChainIdModule, "fetchChainId")
        fetchChainIdSpy.mockImplementation(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve("testnet")
            }, 0)
          })
        })

        const result1 = await getChainId()
        const result2 = await getChainId()

        expect(fetchChainIdSpy).toHaveBeenCalledTimes(1)
        expect(result1).toEqual("testnet")
        expect(result2).toEqual("testnet")
      }
    )
  })

  it("getChainId does not cache requests if access node changes", async () => {
    await config.overload(
      {"accessNode.api": "https://example.com"},
      async () => {
        const fetchChainIdSpy = jest.spyOn(fetchChainIdModule, "fetchChainId")
        fetchChainIdSpy.mockImplementation(() => {
          return new Promise(async resolve => {
            const accessNode = await config.get("accessNode.api")
            setTimeout(() => {
              if (accessNode === "https://example.com") {
                resolve("testnet")
              } else {
                resolve("mainnet")
              }
            }, 0)
          })
        })

        const result1 = await getChainId()
        config.put("accessNode.api", "https://example2.com")
        const result2 = await getChainId()

        expect(fetchChainIdSpy).toHaveBeenCalledTimes(2)
        expect(result1).toEqual("testnet")
        expect(result2).toEqual("mainnet")
      }
    )
  })

  it("getChainId uses opts.node if specified", async () => {
    await config.overload(
      {"accessNode.api": "https://example.com"},
      async () => {
        const fetchChainIdSpy = jest.spyOn(fetchChainIdModule, "fetchChainId")
        fetchChainIdSpy.mockImplementation((opts = {}) => {
          return new Promise((resolve, reject) => {
            if (opts.node === "https://example2.com") {
              resolve("testnet")
            } else {
              reject(new Error("Invalid node"))
            }
          })
        })

        const result = await getChainId({node: "https://example2.com"})
        await getChainId({node: "https://example2.com"})

        // Should only be called once since we are using opts.node
        expect(fetchChainIdSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual("testnet")
      }
    )
  })

  it("getChainId prefers accessNode.api over flow.network or en v", async () => {
    await config.overload(
      {"flow.network": "testnet", env: "testnet", "accessNode.api": "foobar"},
      async () => {
        const fetchChainIdSpy = jest.spyOn(fetchChainIdModule, "fetchChainId")
        fetchChainIdSpy.mockImplementation(() => {
          return Promise.resolve("mainnet")
        })

        const result = await getChainId()

        expect(result).toEqual("mainnet")
      }
    )
  })

  it("getChainId falls back to flow.network", async () => {
    await config.overload({"flow.network": "testnet"}, async () => {
      const fetchChainIdSpy = jest.spyOn(fetchChainIdModule, "fetchChainId")
      fetchChainIdSpy.mockImplementation(() => {
        return Promise.reject(new Error("Invalid node"))
      })

      const result = await getChainId()

      expect(result).toEqual("testnet")
    })
  })
})
