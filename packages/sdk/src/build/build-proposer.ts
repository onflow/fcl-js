import {TransactionRole} from "@onflow/typedefs"
import {AccountAuthorization, prepAccount} from "../interaction/interaction"

export function proposer(authz: AccountAuthorization) {
  return prepAccount(authz, {
    role: TransactionRole.PROPOSER,
  })
}
