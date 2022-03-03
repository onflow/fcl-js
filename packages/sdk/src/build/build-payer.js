import {prepAccount, PAYER} from "../interaction/interaction.js"

export async function payer(authz) {
  return prepAccount(authz, {role: PAYER})
}
