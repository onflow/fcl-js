import {
  initInteraction,
  isGetNetworkParameters,
} from "../interaction/interaction"
import {getNetworkParameters} from "./build-get-network-parameters.js"

describe("Build Get Network Parameters", () => {
  test("Get Network Parameters", async () => {
    let ix = await getNetworkParameters()(initInteraction())

    expect(isGetNetworkParameters(ix)).toBe(true)
  })
})
