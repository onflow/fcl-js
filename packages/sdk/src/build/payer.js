import {pipe} from "@qvvg/mario"
import {put} from "@onflow/assigns"

export const payer = authz =>
  pipe([
    put("payerAuthorization", authz)
  ])
