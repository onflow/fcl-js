import {pipt, put, makeGetAccount} from "@onflow/interaction"

export function getAccount(acct) {
  return pipe([makeGetAccount, put("ga.acct", acct)])
}
