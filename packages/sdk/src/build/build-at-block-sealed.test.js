import {initInteraction} from "../interaction/interaction"
import {atBlockSealed} from "./build-at-block-sealed.js"

describe("Build At Block Sealed", () => {
  test("At Block ID", async () => {
    const blockHeight = 123

    const ix = await atBlockSealed()(initInteraction())

    expect(ix.block.height).toBe(blockHeight)
  })
})
