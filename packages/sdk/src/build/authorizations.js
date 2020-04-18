import {pipe, put} from "@onflow/interaction"

export function authorizations(ax = []) {
  return pipe([
    put("tx.authorizations", ax)
  ])
}

export function authorization(acct, signFn, keyId) {
  return {acct, signFn, keyId}
}
