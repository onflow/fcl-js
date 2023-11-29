import { TransactionRole } from "@onflow/typedefs"
import {prepAccount} from "../interaction/interaction"

export async function proposer(authz) {
  return prepAccount(authz, {role: TransactionRole.PROPOSER})
}
