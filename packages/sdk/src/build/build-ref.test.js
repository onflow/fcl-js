import {interaction} from "../interaction/interaction.js"
import {ref} from "./build-ref.js"

describe("Build Ref", () => {
  test("Build Ref", async () => {
    const refBlockId = "abc123"

    let ix = await ref(refBlockId)(interaction())
    
    expect(ix.message.refBlock).toEqual(refBlockId)
  })
})
