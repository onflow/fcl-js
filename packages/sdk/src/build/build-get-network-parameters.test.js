import {
  interaction,
  isGetNetworkParameters,
} from "../interaction/interaction.js"
import {getNetworkParameters} from "./build-get-network-parameters.js"

describe("Build Get Network Parameters", () => {
  test("Get Network Parameters", async () => {
    let ix = await getNetworkParameters()(interaction())

    expect(isGetNetworkParameters(ix)).toBe(true)
  })
})
