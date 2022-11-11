import {interaction, isPing} from "../interaction/interaction"
import {ping} from "./build-ping"

describe("Build Ping", () => {
  test("Build Ping", async () => {
    let ix = await ping()(interaction())

    expect(isPing(ix)).toBe(true)
  })
})
