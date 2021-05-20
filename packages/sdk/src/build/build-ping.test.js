import {interaction, isPing} from "../interaction/interaction.js"
import {ping} from "./build-ping.js"

describe("Build Ping", () => {
  test("Build Ping", async () => {
    let ix = await ping()(interaction())
    
    expect(isPing(ix)).toBe(true)
  })
})
