import {config} from "@onflow/config"
import assert from "assert"
import { getChainId } from "./getChainId"

describe("getChainId", () => {

  it("getChainId assuming it's already in config", async () => {
    config.put("flow.network.default", "testnet")

    const network = await getChainId()
    assert.equal("testnet", network)
  })
})
