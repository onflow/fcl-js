import {interaction} from "../interaction/interaction"
import {limit} from "./build-limit"

describe("Build Limit", () => {
  test("Build Limit", async () => {
    const txLimit = 100

    let ix = await limit(txLimit)(interaction())

    expect(ix.message.computeLimit).toEqual(txLimit)
  })
})
