import {getChainId, clearChainIdCache} from "./get-chain-id"
import { config } from "@onflow/config"
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
          return new Promise((resolve) => {
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
          return new Promise(async (resolve) => {
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
})
