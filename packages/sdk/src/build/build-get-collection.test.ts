import {interaction, isGetCollection} from "../interaction/interaction"
import {getCollection} from "./build-get-collection"

describe("Build Get Collection", () => {
  test("Get Collection", async () => {
    const collectionId = "my-collection-id"

    const ix = await getCollection(collectionId)(interaction())

    expect(isGetCollection(ix)).toBe(true)
    expect(ix.collection.id).toBe(collectionId)
  })
})
