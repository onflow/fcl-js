import {atBlockHeight} from "../build/build-at-block-height"
import {atBlockId} from "../build/build-at-block-id"
import {atLatestBlock} from "../build/build-at-latest-block"
import {getAccount} from "../build/build-get-account"
import {invariant} from "@onflow/util-invariant"
import {decodeResponse as decode} from "../decode/decode"
import {send} from "../send/send"
import type {Account, Interaction} from "@onflow/typedefs"

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
  if (id) {
    const ix = await send(
      [
        getAccount(address) as unknown as (ix: Interaction) => Interaction,
        atBlockId(id) as unknown as (ix: Interaction) => Interaction,
      ],
      opts
    )
    return decode(ix)
  }

  // Get account by height
  if (height) {
    const ix = await send(
      [
        getAccount(address) as unknown as (ix: Interaction) => Interaction,
        atBlockHeight(height) as unknown as (ix: Interaction) => Interaction,
      ],
      opts
    )
    return decode(ix)
  }

  // Get account by latest block
  const ix = await send(
    [
      getAccount(address) as unknown as (ix: Interaction) => Interaction,
      atLatestBlock(isSealed ?? false) as unknown as (
        ix: Interaction
      ) => Interaction,
    ],
    opts
  )
  return decode(ix)
}
