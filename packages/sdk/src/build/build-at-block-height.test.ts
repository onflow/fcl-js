import {interaction} from "../interaction/interaction"
import {atBlockHeight} from "./build-at-block-height"

describe("Build At Block ID", () => {
  test("At Block ID", async () => {
    const blockHeight = 123

    const ix = await atBlockHeight(blockHeight)(interaction())

    expect(ix.block.height).toBe(blockHeight)
  })
})
