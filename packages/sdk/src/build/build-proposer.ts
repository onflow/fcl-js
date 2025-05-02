import {TransactionRole, InteractionAccount} from "@onflow/typedefs"
import {AccountFn, prepAccount} from "../interaction/interaction"

export function proposer(authz: InteractionAccount | AccountFn) {
  return prepAccount(authz, {
    role: TransactionRole.PROPOSER,
  })
}
