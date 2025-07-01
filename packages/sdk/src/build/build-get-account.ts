import {sansPrefix} from "@onflow/util-address"
import {
  InteractionBuilderFn,
  makeGetAccount,
  Ok,
  pipe,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get an account by address.
 *
 * Consider using the pre-built interaction 'fcl.account(address)' if you do not need to pair with any other builders.
 *
 * Account address is a unique account identifier. Be mindful about the '0x' prefix, you should use the prefix as a default representation but be careful and safely handle user inputs without the prefix.
 *
 * @param address Address of the user account with or without a prefix (both formats are supported)
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // somewhere in an async function
 * // fcl.account is the same as this function
 * const getAccount = async (address) => {
 *   const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
 *   return account;
 * };
 */
export function getAccount(addr: string): InteractionBuilderFn {
  return pipe([
    makeGetAccount,
    ix => {
      ix.account.addr = sansPrefix(addr)
      return Ok(ix)
    },
  ])
}
