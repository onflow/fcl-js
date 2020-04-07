import {pipe, put} from "@onflow/interaction"

export function payer(authz) {
  return pipe([
    put("tx.payer", authz)
  ])
}
