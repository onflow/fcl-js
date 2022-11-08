import {interaction, isGetCollection} from "../interaction/interaction.js"
import {getCollection} from "./build-get-collection.js"

describe("Build Get Collection", () => {
  test("Get Collection", async () => {
    const collectionId = "my-collection-id"

    const ix = await getCollection(collectionId)(interaction())

    expect(isGetCollection(ix)).toBe(true)
    expect(ix.collection.id).toBe(collectionId)
  })
})
