import {initInteraction} from "../interaction/interaction.js"
import {atLatestBlock} from "./build-at-latest-block.js"

describe("Build At Latest Block", () => {
  test("At Latest Sealed Block", async () => {
    const ix = await atLatestBlock(true)(initInteraction())

    expect(ix.block.isSealed).toBe(true)
  })

  test("At Latest Executed Block", async () => {
    const ix = await atLatestBlock(false)(initInteraction())

    expect(ix.block.isSealed).toBe(false)
  })
})
