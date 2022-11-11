import {prepAccount, PROPOSER} from "../interaction/interaction"

export async function proposer(authz) {
  return prepAccount(authz, {role: PROPOSER})
}
