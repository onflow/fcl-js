import {initInteraction} from "../interaction/interaction"
import {ref} from "./build-ref.js"

describe("Build Ref", () => {
  test("Build Ref", async () => {
    const refBlockId = "abc123"

    let ix = await ref(refBlockId)(initInteraction())

    expect(ix.message.refBlock).toEqual(refBlockId)
  })
})
