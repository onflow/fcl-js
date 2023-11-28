import {pipe, makeGetAccount, Ok} from "../interaction/interaction"
import {sansPrefix} from "@onflow/util-address"

/**
 * @description - A builder function that returns the interaction to get an account by address
 * @param {string} addr - The address of the account to getq
 * @returns {Function} - An interaction object
 */
export function getAccount(addr) {
  return pipe([
    makeGetAccount,
    ix => {
      ix.account.addr = sansPrefix(addr)
      return Ok(ix)
    },
  ])
}
