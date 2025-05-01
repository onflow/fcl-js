import {TransactionRole, InteractionAccount} from "@onflow/typedefs"
import {AccountFn, pipe, prepAccount} from "../interaction/interaction"

/**
 * @description A builder function that adds payer account(s) to a transaction
 * @param ax An account address or array of account addresses
 * @returns A function that takes an interaction and returns a new interaction with the payer(s) added
 */
export function payer(
  ax: InteractionAccount | AccountFn | (InteractionAccount | AccountFn)[] = []
) {
  if (!Array.isArray(ax)) ax = [ax]
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {
        role: TransactionRole.PAYER,
      })
    })
  )
}
