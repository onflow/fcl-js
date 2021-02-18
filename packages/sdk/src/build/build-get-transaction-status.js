import {pipe, Ok, makeGetTransactionStatus} from "../interaction/interaction.js"

export function getTransactionStatus(transactionId) {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transactionId = transactionId
      return Ok(ix)
    }
  ])
}
