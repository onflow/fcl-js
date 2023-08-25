import {initInteraction, isGetBlockHeader} from "../interaction/interaction"
import {getBlockHeader} from "./build-get-block-header.js"

describe("Build Get Block Header", () => {
  test("Get Block Header, isSealed = false", async () => {
    const isSealed = false

    const ix = await getBlockHeader(isSealed)(initInteraction())

    expect(isGetBlockHeader(ix)).toBe(true)
    expect(ix.block.isSealed).toEqual(isSealed)
  })

  test("Get Block Header, isSealed = true", async () => {
    const isSealed = true

    const ix = await getBlockHeader(isSealed)(initInteraction())

    expect(isGetBlockHeader(ix)).toBe(true)
    expect(ix.block.isSealed).toEqual(isSealed)
  })
})
