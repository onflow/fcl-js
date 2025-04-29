import {TransactionRole, InteractionAccount} from "@onflow/typedefs"
import {pipe, prepAccount} from "../interaction/interaction"

type AccountFn = (acct: InteractionAccount) => InteractionAccount

/**
 * @description A builder function that adds payer account(s) to a transaction
 * @param ax An account address or array of account addresses
 * @returns A function that takes an interaction and returns a new interaction with the payer(s) added
 */
export function payer(
  ax:
    | InteractionAccount
    | AccountFn
    | Partial<InteractionAccount>
    | Array<InteractionAccount | AccountFn | Partial<InteractionAccount>> = []
) {
  if (!Array.isArray(ax)) ax = [ax]
  return pipe(
    ax.map(authz => {
      return prepAccount(authz as InteractionAccount | AccountFn, {
        role: TransactionRole.PAYER,
      })
    })
  )
}
