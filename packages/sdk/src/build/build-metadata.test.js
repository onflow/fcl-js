import {interaction} from "../interaction/interaction.js"
import {meta} from "./build-metadata.js"

const META = {
  title: "Kitty Kangol",
  description: "A cool cat hat",
  price: "10",
  image: "https://i.imgur.com/a/JPmBk9R.png",
}

describe("Build Meta", () => {
  test("build valid meta", async () => {
    let ix = await meta({
      title: "Kitty Kangol",
      description: "A cool cat hat",
      price: "10",
      image: "https://i.imgur.com/a/JPmBk9R.png",
    })(interaction())
    expect(ix.metadata).toEqual(META)
  })

  test("throw on invalid meta", async () => {
    await expect(
      meta({
        title: "Kitty Kangol",
        description: "A cool cat hat",
        price: "10",
        image: {
          url: "https://i.imgur.com/a/JPmBk9R.png",
          width: "200",
          height: "200",
          alt: "An adorable NFT",
        },
      })
    ).rejects.toThrow(Error)
  })

  test("scrub meta fields", async () => {
    let ix = await meta({
      title: "Kitty Kangol",
      description: "A cool cat hat",
      price: "10",
      image: "https://i.imgur.com/a/JPmBk9R.png",
      foo: "bar",
    })(interaction())
    expect(ix.metadata).toEqual(META)
  })
})
