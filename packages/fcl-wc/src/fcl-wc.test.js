import {config} from "@onflow/config"

describe("Init Client", () => {
  it("should throw without projectId", async () => {
    async function testFn() {

      // Mock transport then import fcl-wc because startup of fcl will call getChainId util which hits the chain
      await config.overload(
        {
          "flow.network.default": "testnet",
          "sdk.transport": async ix => ix
        },
        async () => {
          const fclWC = require("./fcl-wc")
          await fclWC.init()
        }
      )
    }

    expect.assertions(1)
    await expect(testFn).rejects.toThrow(Error)
  })
})
