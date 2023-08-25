import {initInteraction, isGetBlock} from "../interaction/interaction"
import {getBlock} from "./build-get-block.js"

describe("Build Get Block", () => {
  test("Get Block - isSealed = false", async () => {
    const isSealed = false

    const ix = await getBlock(isSealed)(initInteraction())

    expect(isGetBlock(ix)).toBe(true)
    expect(ix.block.isSealed).toBe(false)
  })

  test("Get Block - isSealed = false", async () => {
    const isSealed = true

    const ix = await getBlock(isSealed)(initInteraction())

    expect(isGetBlock(ix)).toBe(true)
    expect(ix.block.isSealed).toBe(true)
  })
})
