import { AccountRole } from "@onflow/typedefs"
import {prepAccount} from "../interaction/interaction"

export async function proposer(authz) {
  return prepAccount(authz, {role: AccountRole.PROPOSER})
}
