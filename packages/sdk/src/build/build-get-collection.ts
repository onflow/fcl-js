import {
  pipe,
  Ok,
  makeGetCollection,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get a collection by ID
 * @param id The ID of the collection to get
 * @returns A function that processes an interaction object
 */
export function getCollection(id: string | null = null): InteractionBuilderFn {
  return pipe([
    makeGetCollection,
    ix => {
      ix.collection.id = id
      return Ok(ix)
    },
  ])
}
