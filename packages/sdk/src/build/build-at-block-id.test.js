import {interaction} from "../interaction/interaction.js"
import {atBlockId} from "./build-at-block-id.js"

describe("Build At Block ID", () => {
  test("At Block ID", async () => {
    const blockId = "abc123"

    const ix = await atBlockId(blockId)(interaction())

    expect(ix.block.id).toBe(blockId)
  })
})
