import {interaction, isGetBlock} from "../interaction/interaction.js"
import {getBlock} from "./build-get-block.js"

describe("Build Get Block", () => {
  test("Get Block - isSealed = false", async () => {
    const isSealed = false

    const ix = await getBlock(isSealed)(interaction())

    expect(isGetBlock(ix)).toBe(true)
    expect(ix.block.isSealed).toBe(false)
  })

  test("Get Block - isSealed = false", async () => {
    const isSealed = true

    const ix = await getBlock(isSealed)(interaction())

    expect(isGetBlock(ix)).toBe(true)
    expect(ix.block.isSealed).toBe(true)
  })
})
