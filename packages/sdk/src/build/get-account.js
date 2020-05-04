import {pipe, makeGetAccount, Ok} from "@onflow/interaction"

export function getAccount(addr) {
  return pipe([
    makeGetAccount,
    ix => {
      ix.accountAddr = addr
      return Ok(ix)
    }
  ])
}
