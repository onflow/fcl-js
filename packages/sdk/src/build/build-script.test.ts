import {interaction, isScript} from "../interaction/interaction"
import {script} from "./build-script"

describe("Build Script", () => {
  test("Build Script", async () => {
    const cadence = "pub fun main(): Int { return 123 }"

    let ix = await script(cadence)(interaction())

    expect(isScript(ix)).toBe(true)
    expect(ix.assigns["ix.cadence"]).not.toBeUndefined()
  })
})
