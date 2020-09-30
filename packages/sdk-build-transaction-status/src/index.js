import {pipe, Ok, makeGetTransactionStatus} from "@onflow/interaction"

export function getTransactionStatus(transactionId) {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transactionId = transactionId
      return Ok(ix)
    }
  ])
}
