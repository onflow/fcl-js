import {watchForChainIdChanges} from "./chain-id-watcher"
import {config} from "@onflow/config"
import * as chainIdUtils from "./get-chain-id"

describe("chain-id-watcher", () => {
  let unsubscribe

  afterEach(() => {
    jest.restoreAllMocks()
    unsubscribe && unsubscribe()
  })

  test("flow.network.default is correctly set on first call", async () => {
    await config.overload(
      {"accessNode.api": "https://example.com"},
      async () => {
        // Mock the setChainIdDefault function
        const spy = jest.spyOn(chainIdUtils, "getChainId")
        spy.mockImplementation(async () => {})

        // Start watching for changes
        unsubscribe = watchForChainIdChanges()

        // Wait for microtask queue to flush
        await new Promise(resolve => setTimeout(resolve, 0))

        // Expect only one call at initial setup
        expect(chainIdUtils.getChainId).toHaveBeenCalledTimes(1)
      }
    )
  })

  test("flow.network.default is correctly set when changed later", async () => {
    await config.overload({}, async () => {
      // Mock the setChainIdDefault function
      const spy = jest.spyOn(chainIdUtils, "getChainId")
      spy.mockImplementation(async () => {})

      // Start watching for changes
      unsubscribe = watchForChainIdChanges()

      // Wait for microtask queue to flush
      await new Promise(resolve => setTimeout(resolve, 0))

      config.put("accessNode.api", "https://example.com")

      // Wait for microtask queue to flush
      await new Promise(resolve => setTimeout(resolve, 0))

      // Expect two calls since we changed the access node and there is an initial call
      expect(chainIdUtils.getChainId).toHaveBeenCalledTimes(2)
    })
  })

  test("watcher does not throw error if getChainId throws", async () => {
    await config.overload({}, async () => {
      // Mock the setChainIdDefault function
      const spy = jest.spyOn(chainIdUtils, "getChainId")
      spy.mockImplementation(async () => {
        throw new Error("dummy error")
      })

      // Start watching for changes
      unsubscribe = watchForChainIdChanges()

      // Wait for microtask queue to flush
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  })
})
