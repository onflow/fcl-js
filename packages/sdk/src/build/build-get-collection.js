import {pipe, Ok, makeGetCollection} from "../interaction/interaction.js"

export function getCollection(id = null) {
  return pipe([
    makeGetCollection,
    ix => {
      ix.collection.id = id
      return Ok(ix)
    }
  ])
}
