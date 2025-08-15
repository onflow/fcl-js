import type {Account} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"
import {atBlockHeight} from "../build/build-at-block-height"
import {atBlockId} from "../build/build-at-block-id"
import {atLatestBlock} from "../build/build-at-latest-block"
import {getAccount} from "../build/build-get-account"
import {decodeResponse as decode} from "../decode/decode"
import {SdkContext} from "../context/context"
import {withGlobalContext} from "../context/global"
import {createSend} from "../transport/send/send"

export interface AccountQueryOptions {
  height?: number
  id?: string
  isSealed?: boolean
}

export function createAccount(context: SdkContext) {
  async function account(
    address: string,
    {height, id, isSealed}: AccountQueryOptions = {},
    opts?: object
  ): Promise<Account> {
    invariant(
      !((id && height) || (id && isSealed) || (height && isSealed)),
      `Method: account -- Only one of the following parameters can be provided: id, height, isSealed`
    )

    // Get account by ID
    if (id)
      return await createSend(context)(
        [getAccount(address), atBlockId(id)],
        opts
      ).then(decode)

    // Get account by height
    if (height)
      return await createSend(context)(
        [getAccount(address), atBlockHeight(height)],
        opts
      ).then(decode)

    // Get account by latest block
    return await createSend(context)(
      [getAccount(address), atLatestBlock(isSealed ?? false)],
      opts
    ).then(decode)
  }

  return account
}

/**
 * Retrieve any account from Flow network's latest block or from a specified block height.
 *
 * Account address is a unique account identifier. Be mindful about the '0x' prefix, you should use the prefix as a default representation but be careful and safely handle user inputs without the prefix.
 *
 * An account includes the following data:
 * - Address: the account address.
 * - Balance: balance of the account.
 * - Contracts: list of contracts deployed to the account.
 * - Keys: list of keys associated with the account.
 *
 * @param address Address of the account
 * @param queryOptions Query parameters
 * @param queryOptions.height Block height to query
 * @param queryOptions.id Block ID to query
 * @param queryOptions.isSealed Block finality
 * @param opts Optional parameters
 * @returns A promise that resolves to an Account object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get account from latest block height
 * const account = await fcl.account("0x1d007d755706c469");
 * console.log("Address:", account.address);
 * console.log("Balance:", account.balance);
 * console.log("Keys:", account.keys);
 * console.log("Contracts:", Object.keys(account.contracts));
 *
 * // Get account at a specific block height
 * const historicalAccount = await fcl.account("0x1d007d755706c469", {
 *   height: 12345
 * });
 *
 * // Get account at a specific block ID
 * const accountAtBlock = await fcl.account("0x1d007d755706c469", {
 *   id: "9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3"
 * });
 *
 * // Get account from sealed block
 * const sealedAccount = await fcl.account("0x1d007d755706c469", {
 *   isSealed: true
 * });
 *
 * // Alternative using builder pattern
 * fcl.send([
 *   fcl.getAccount("0x1d007d755706c469"),
 *   fcl.atBlockHeight(123)
 * ]).then(fcl.decode);
 */
export const account = /* @__PURE__ */ withGlobalContext(createAccount)
