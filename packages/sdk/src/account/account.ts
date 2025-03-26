import {atBlockHeight} from "../build/build-at-block-height.js"
import {atBlockId} from "../build/build-at-block-id.js"
import {atLatestBlock} from "../build/build-at-latest-block.js"
import {getAccount} from "../build/build-get-account.js"
import {invariant} from "@onflow/util-invariant"
import {decodeResponse as decode} from "../decode/decode.js"
import {send} from "../send/send.js"
import type {Account} from "@onflow/typedefs"

/**
 * @description Returns the details of an account from their public address
 * @param address - Address of the account
 * @param queryOptions - Query parameters
 * @param queryOptions.height - Block height to query
 * @param queryOptions.id - Block ID to query
 * @param queryOptions.isSealed - Block finality
 * @param opts - Optional parameters
 * @returns A promise that resolves to an account response
 */
export async function account(
  address: string,
  {
    height,
    id,
    isSealed,
  }: {height?: number; id?: string; isSealed?: boolean} = {},
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
    return await send([getAccount(address), atBlockHeight(height)], opts).then(
      decode
    )

  // Get account by latest block
  return await send(
    [getAccount(address), atLatestBlock(isSealed ?? false)],
    opts
  ).then(decode)
}
