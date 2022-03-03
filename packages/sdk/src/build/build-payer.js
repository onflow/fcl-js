import {pipe, prepAccount, PAYER} from "../interaction/interaction.js"

export async function payer(authz) {
  if (Array.isArray(authz)) {
    return pipe(
      authz.map(az => {
        return prepAccount(az, {role: PAYER})
      })
    )
  }
  return prepAccount(authz, {role: PAYER})
}
