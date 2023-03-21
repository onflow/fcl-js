import {config} from "@onflow/config"
import assert from "assert"
import {getChainId} from "./getChainId"

describe("getChainId", () => {
  it("getChainId assuming it's already in config", async () => {
    let network

    await config.overload({"flow.network.default": "testnet"}, async () => {
      network = await getChainId()
    })

    assert.equal(network, "testnet")
  })
})
