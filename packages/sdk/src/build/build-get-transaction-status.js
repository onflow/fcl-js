import {pipe, Ok, makeGetTransactionStatus} from "../interaction/interaction.js"

export function getTransactionStatus(transactionId) {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    }
  ])
}
