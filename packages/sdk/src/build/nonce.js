import {pipe, put} from "@onflow/interaction"

export function nonce(nonce) {
  return pipe([put("tx.nonce", nonce)])
}
