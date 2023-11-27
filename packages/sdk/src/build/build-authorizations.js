import { AccountRole } from "@onflow/typedefs"
import {pipe, prepAccount} from "../interaction/interaction"

export function authorizations(ax = []) {
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {role: AccountRole.AUTHORIZER})
    })
  )
}

export function authorization(addr, signingFunction, keyId, sequenceNum) {
  return {addr, signingFunction, keyId, sequenceNum}
}
