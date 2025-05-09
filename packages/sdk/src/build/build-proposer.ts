import {TransactionRole} from "@onflow/typedefs"
import {AccountFn, prepAccount} from "../interaction/interaction"

export function proposer(authz: AccountFn) {
  return prepAccount(authz, {
    role: TransactionRole.PROPOSER,
  })
}
