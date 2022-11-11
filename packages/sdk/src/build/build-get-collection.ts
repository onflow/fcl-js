import {pipe, makeGetCollection} from "../interaction/interaction"

export function getCollection(id = null) {
  return pipe([
    makeGetCollection,
    ix => {
      ix.collection.id = id
      return ix
    },
  ])
}
