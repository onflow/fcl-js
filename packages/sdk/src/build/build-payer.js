import {pipe, prepAccount, PAYER} from "../interaction/interaction"

export function payer(ax = []) {
  if (!Array.isArray(ax)) ax = [ax]
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {role: PAYER})
    })
  )
}
