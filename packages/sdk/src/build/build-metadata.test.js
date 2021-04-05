import {interaction} from "../interaction/interaction.js"
import {meta} from "./build-metadata.js"

describe("Build Meta", () => {
  test("Build Meta", async () => {
    const metadata = {
      title: "Kitty Kangol",
      description: "A cool cat hat",
      price: "10",
      image: null,
    }

    let ix = await meta({
      title: "Kitty Kangol",
      description: "A cool cat hat",
      price: "10",
    })(interaction())
    expect(ix.metadata).toEqual(metadata)
  })
})
