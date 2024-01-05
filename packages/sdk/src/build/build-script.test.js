import {initInteraction, isScript} from "../interaction/interaction"
import {script} from "./build-script.js"

describe("Build Script", () => {
  test("Build Script", async () => {
    const cadence = "access(all) fun main(): Int { return 123 }"

    let ix = await script(cadence)(initInteraction())

    expect(isScript(ix)).toBe(true)
    expect(ix.assigns["ix.cadence"]).not.toBeUndefined()
  })
})
