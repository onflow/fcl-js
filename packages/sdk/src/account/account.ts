import type {Account} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"
import {atBlockHeight} from "../build/build-at-block-height"
import {atBlockId} from "../build/build-at-block-id"
import {atLatestBlock} from "../build/build-at-latest-block"
import {getAccount} from "../build/build-get-account"
import {decodeResponse as decode} from "../decode/decode"
import {send} from "../transport"
import {SdkContext} from "../context/context"
import {withGlobalContext} from "../context/global"

export interface AccountQueryOptions {
  height?: number
  id?: string
  isSealed?: boolean
}

export function createAccount(context: SdkContext) {
  /**
   * @description Returns the details of an account from their public address
   * @param address Address of the account
   * @param queryOptions Query parameters
   * @param queryOptions.height Block height to query
   * @param queryOptions.id Block ID to query
   * @param queryOptions.isSealed Block finality
   * @param opts Optional parameters
   * @returns A promise that resolves to an account response
   */
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
      return await send([getAccount(address), atBlockId(id)], opts).then(decode)

    // Get account by height
    if (height)
      return await send(
        [getAccount(address), atBlockHeight(height)],
        opts
      ).then(decode)

    // Get account by latest block
    return await send(
      [getAccount(address), atLatestBlock(isSealed ?? false)],
      opts
    ).then(decode)
  }

  return account
}

/* @__PURE__ */
export const account = withGlobalContext(createAccount)
