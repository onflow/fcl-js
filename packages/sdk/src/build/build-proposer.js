import {prepAccount, PROPOSER} from "../interaction/interaction.js"

export async function proposer(authz) {
  return prepAccount(authz, {role: PROPOSER})
}
