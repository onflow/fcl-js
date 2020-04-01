import {pipe, put, makeGetTransaction} from "@onflow/interaction"

export function getTransaction(txId) {
  return pipe([makeGetTransaction, put("gt.txId", txId)])
}
