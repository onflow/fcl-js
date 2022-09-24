import {config} from "@onflow/config"
import {getNetwork} from "./getNetwork"
import assert from "assert"

describe("getNetwork", () => {

  it("Connects to testnet and returns testnet", async () => {
    config.put("accessNode.api", "https://rest-testnet.onflow.org")

    const network = await getNetwork()
    assert.equal("testnet", network)
  })

  it("Connects to mainnet and returns mainnet", async () => {
    config.put("accessNode.api", "https://rest-mainnet.onflow.org")

    const network = await getNetwork()
    assert.equal("mainnet", network)
  })
})
