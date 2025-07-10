import {watchForChainIdChanges} from "./chain-id-watcher"
import {config} from "@onflow/config"
import {createGetChainId} from "./get-chain-id"

jest.mock("./get-chain-id")

describe("chain-id-watcher", () => {
  let unsubscribe: () => void

  afterEach(() => {
    jest.restoreAllMocks()
    unsubscribe?.()
  })

  test("flow.network.default is correctly set on first call", async () => {
    await config.overload(
      {"accessNode.api": "https://example.com"},
      async () => {
        // Mock the getChainId function
        const mockGetChainId = jest.fn(async () => "testnet")
        jest.mocked(createGetChainId).mockReturnValue(mockGetChainId)

        // Start watching for changes
        unsubscribe = watchForChainIdChanges()

        // Wait for microtask queue to flush
        await new Promise(resolve => setTimeout(resolve, 0))

        // Expect only one call at initial setup
        expect(createGetChainId).toHaveBeenCalledTimes(1)
        expect(mockGetChainId).toHaveBeenCalledTimes(1)
      }
    )
  })

  test("flow.network.default is correctly set when changed later", async () => {
    await config.overload({}, async () => {
      // Mock the getChainId function
      const mockGetChainId = jest.fn(async () => "testnet")
      jest.mocked(createGetChainId).mockReturnValue(mockGetChainId)

      // Start watching for changes
      unsubscribe = watchForChainIdChanges()

      // Wait for microtask queue to flush
      await new Promise(resolve => setTimeout(resolve, 0))

      config.put("accessNode.api", "https://example.com")

      // Wait for microtask queue to flush
      await new Promise(resolve => setTimeout(resolve, 0))

      // Expect two calls since we changed the access node and there is an initial call
      expect(mockGetChainId).toHaveBeenCalledTimes(2)
    })
  })

  test("watcher does not throw error if getChainId throws", async () => {
    await config.overload({}, async () => {
      jest.mocked(createGetChainId).mockImplementation(() => {
        return jest.fn(() => {
          throw new Error("Test error")
        })
      })

      // Start watching for changes
      unsubscribe = watchForChainIdChanges()

      // Wait for microtask queue to flush
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  })
})
