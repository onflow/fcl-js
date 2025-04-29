import {
  InteractionCallback,
  Ok,
  makeGetTransaction,
  pipe,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get a transaction by ID
 * @param id The ID of the transaction to get
 * @returns A function that processes an interaction object
 */
export function getTransaction(id: string): InteractionCallback {
  return pipe([
    makeGetTransaction,
    ix => {
      ix.transaction.id = id
      return Ok(ix)
    },
  ])
}
