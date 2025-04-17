import {TransactionRole} from "../types"
import {prepAccount} from "../interaction/interaction"

export function proposer(authz) {
  return prepAccount(authz, {role: TransactionRole.PROPOSER})
}
