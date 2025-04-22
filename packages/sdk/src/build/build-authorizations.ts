import {
  TransactionRole,
  InteractionAccount,
  Interaction,
} from "@onflow/typedefs"
import {pipe, prepAccount} from "../interaction/interaction"

type AccountFn = (acct: InteractionAccount) => InteractionAccount
type AuthorizationFunction = () => {signature: string}

export function authorizations(
  ax: Array<InteractionAccount | AccountFn | Partial<InteractionAccount>> = []
) {
  return pipe(
    ax.map(authz => {
      return prepAccount(authz as InteractionAccount | AccountFn, {
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
