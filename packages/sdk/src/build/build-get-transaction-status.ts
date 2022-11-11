import {pipe, Ok, makeGetTransactionStatus} from "../interaction/interaction"

export function getTransactionStatus(transactionId) {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    },
  ])
}
