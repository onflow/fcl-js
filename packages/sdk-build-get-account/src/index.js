import {pipe, makeGetAccount, Ok} from "@onflow/interaction"
import {sansPrefix} from "@onflow/util-address"

export function getAccount(addr) {
  return pipe([
    makeGetAccount,
    ix => {
      ix.account.addr = sansPrefix(addr)
      return Ok(ix)
    }
  ])
}
