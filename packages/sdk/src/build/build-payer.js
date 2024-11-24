import {TransactionRole} from "@onflow/typedefs"
import {pipe, prepAccount} from "../interaction/interaction"

/**
 * @description - A builder function that adds payer account(s) to a transaction
 * @param {Function | Function[] | Object | Object[]} ax - An account address or array of account addresses
 * @returns {Function} - An interaction object
 */
export function payer(ax = []) {
  if (!Array.isArray(ax)) ax = [ax]
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {role: TransactionRole.PAYER})
    })
  )
}
