import {pipe, Ok, makeGetTransaction} from "@onflow/interaction"

export function getTransaction(txId) {
  return pipe([
    makeGetTransaction,
    ix => {
      ix.txId = txId
      return Ok(ix)
    }
  ])
}
