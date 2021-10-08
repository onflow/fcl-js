import {interaction} from "../interaction/interaction.js"
import {preSendCheck} from "./build-pre-send-check"

describe("Build preSendCheck", () => {
  test("Build preSendCheck", async () => {
    const checkFunc = async () => "test func"

    const ix = await preSendCheck(checkFunc)(interaction())

    expect(ix.assigns["ix.pre-send-check"]).toEqual(checkFunc)
  })
})
