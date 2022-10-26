import { config } from "@onflow/config"
import * as fclWC from "./fcl-wc"

describe("Init Client", () => {
  it("should throw without projectId", async () => {
    expect.assertions(1)
    config.put("accessNode.api", "https://rest-testnet.onflow.org")
    await expect(fclWC.init()).rejects.toThrow(Error)
  })
})
