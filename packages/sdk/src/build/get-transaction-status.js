import {pipe, Ok, makeGetTransactionStatus} from "@onflow/interaction"

export function getTransactionStatus(txId) {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.txId = txId
      return Ok(ix)
    }
  ])
}
