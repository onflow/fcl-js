import {pipe} from "@qvvg/mario"
import {makeGetTransaction} from "@onflow/interaction"
import {put} from "@onflow/assigns"

export const getTransaction = txHash =>
  pipe([makeGetTransaction, put("hash", txHash)])
