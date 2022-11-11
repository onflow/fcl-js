import {interaction} from "../interaction/interaction"
import {atBlockId} from "./build-at-block-id"

describe("Build At Block ID", () => {
  test("At Block ID", async () => {
    const blockId = "abc123"

    const ix = await atBlockId(blockId)(interaction())

    expect(ix.block.id).toBe(blockId)
  })
})
