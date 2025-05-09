import {initInteraction, isPing} from "../interaction/interaction"
import {ping} from "./build-ping"

describe("Build Ping", () => {
  test("Build Ping", async () => {
    let ix = await ping()(initInteraction())

    expect(isPing(ix)).toBe(true)
  })
})
