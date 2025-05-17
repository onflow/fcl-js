import {initInteraction} from "../interaction/interaction"
import {atBlockHeight} from "./build-at-block-height"

describe("Build At Block Height", () => {
  test("At Block Height", async () => {
    const blockHeight = 123

    const ix = await atBlockHeight(blockHeight)(initInteraction())

    expect(ix.block.height).toBe(blockHeight)
  })
})
