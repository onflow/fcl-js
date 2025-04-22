import {TransactionRole, InteractionAccount} from "@onflow/typedefs"
import {prepAccount} from "../interaction/interaction"

type AccountFn = ((acct: InteractionAccount) => InteractionAccount) &
  Partial<InteractionAccount>

export function proposer(
  authz: InteractionAccount | AccountFn | Partial<InteractionAccount>
) {
  return prepAccount(authz as InteractionAccount | AccountFn, {
    role: TransactionRole.PROPOSER,
  })
}
