import {initInteraction} from "../interaction/interaction"
import {atBlockHeight} from "./build-at-block-height.js"

describe("Build At Block ID", () => {
  test("At Block ID", async () => {
    const blockHeight = 123

    const ix = await atBlockHeight(blockHeight)(initInteraction())

    expect(ix.block.height).toBe(blockHeight)
  })
})
