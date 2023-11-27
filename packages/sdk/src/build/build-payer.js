import { AccountRole } from "@onflow/typedefs"
import {pipe, prepAccount} from "../interaction/interaction"

export function payer(ax = []) {
  if (!Array.isArray(ax)) ax = [ax]
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {role: AccountRole.PAYER})
    })
  )
}
