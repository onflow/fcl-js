import {pipe, makeGetAccount, Ok} from "@onflow/interaction"

export function getAccount(acct) {
  return pipe([
    makeGetAccount,
    ix => {
      ix.acct = acct
      return Ok(ix)
    }
  ])
}
