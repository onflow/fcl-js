import {InteractionAccount, TransactionRole} from "@onflow/typedefs"
import {AccountFn, pipe, prepAccount} from "../interaction/interaction"

type AuthorizationFunction = () => {signature: string}

export function authorizations(ax: Array<InteractionAccount | AccountFn> = []) {
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {
        role: TransactionRole.AUTHORIZER,
      })
    })
  )
}

export function authorization(
  addr: string,
  signingFunction: AuthorizationFunction,
  keyId?: number | string,
  sequenceNum?: number
): Partial<InteractionAccount> {
  return {addr, signingFunction, keyId, sequenceNum}
}
