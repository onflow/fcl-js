import {prepAccount, PAYER} from "../interaction/interaction"

export async function payer(authz) {
  return prepAccount(authz, {role: PAYER})
}
