import {sansPrefix} from "@onflow/util-address"
import {
  InteractionCallback,
  makeGetAccount,
  Ok,
  pipe,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get an account by address
 * @param addr The address of the account to get
 * @returns A function that processes an interaction object
 */
export function getAccount(addr: string): InteractionCallback {
  return pipe([
    makeGetAccount,
    ix => {
      ix.account.addr = sansPrefix(addr)
      return Ok(ix)
    },
  ])
}
