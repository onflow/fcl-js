import {pipe} from "@qvvg/mario"
import {put} from "@onflow/assigns"

export const authorizations = (ax = []) =>
  pipe([
    put("authorizations", ax)
  ])

export const authorization = (acct, signFn) => {
  return {acct, signFn}
}
