import {pipe, Ok, makeGetTransaction} from "../interaction/interaction.js"

export function getTransaction(transactionId) {
  return pipe([
    makeGetTransaction,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    }
  ])
}
