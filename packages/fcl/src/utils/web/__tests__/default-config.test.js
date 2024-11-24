import {getDefaultConfig} from "../default-config"

describe("getDefaultConfig tests", () => {
  it("should return default config", () => {
    const defaultConfig = getDefaultConfig()
    expect(defaultConfig["discovery.wallet.method.default"]).toBe("IFRAME/RPC")
  })
})
