import {config} from "@onflow/config"
import assert from "assert"
import { getChainId } from "./getChainId"

describe("getChainId", () => {

  it("Connects to testnet and returns testnet", async () => {
    config.put("accessNode.api", "https://rest-testnet.onflow.org")

    const network = await getChainId()
    assert.equal("testnet", network)
  })

  it("Connects to mainnet and returns mainnet", async () => {
    config.put("accessNode.api", "https://rest-mainnet.onflow.org")

    const network = await getChainId()
    assert.equal("mainnet", network)
  })
})
