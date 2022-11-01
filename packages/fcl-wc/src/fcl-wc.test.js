import {config} from "@onflow/config"

describe("Init Client", () => {
  it("should throw without projectId", async () => {
    async function initWC() {
      await config.overload(
        {
          "flow.network.default": "testnet",
        },
        fclWC.init
      )
    }

    // Mock transport then import fcl-wc because startup of fcl will call getChainId util which hits the chain
    config.put("sdk.transport", async ix => ix)
    const fclWC = require("./fcl-wc")

    expect.assertions(1)
    await expect(initWC).rejects.toThrow(Error)
  })
})
