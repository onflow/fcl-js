import {initInteraction, isGetNodeVersionInfo} from "../interaction/interaction"
import {getNodeVersionInfo} from "./build-get-node-version-info"

describe("Build Get Node Version Info", () => {
  test("Get Node Version Info", async () => {
    let ix = await getNodeVersionInfo()(initInteraction())

    expect(isGetNodeVersionInfo(ix)).toBe(true)
  })
})
