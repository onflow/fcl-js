import {send} from "../send/send"
import {getBlock} from "../build/build-get-block"
import {atBlockHeight} from "../build/build-at-block-height"
import {atBlockId} from "../build/build-at-block-id"
import {decodeResponse as decode} from "../decode/decode"
import {invariant} from "@onflow/util-invariant"
import type {Block, Interaction} from "../types"

/**
 * @description Returns the latest block (optionally sealed or not), by id, or by height
 * @param queryOptions - Query parameters
 * @param queryOptions.sealed - Whether to query for a sealed block
 * @param queryOptions.height - Block height to query
 * @param queryOptions.id - Block ID to query
 * @param opts - Optional parameters
 * @returns A promise that resolves to a block response
 */
export async function block(
  {
    sealed = false,
    id,
    height,
  }: {sealed?: boolean; id?: string; height?: number} = {},
  opts: object = {}
): Promise<Block> {
  invariant(
    !((sealed && id) || (sealed && height)),
    `Method: block -- Cannot pass "sealed" with "id" or "height"`
  )

  invariant(
    !(id && height),
    `Method: block -- Cannot pass "id" and "height" simultaneously`
  )

  // Get block by ID
  if (id) {
    const ix = await send(
      [
        getBlock() as unknown as (ix: Interaction) => Interaction,
        atBlockId(id) as unknown as (ix: Interaction) => Interaction,
      ],
      opts
    )
    return decode(ix)
  }

  // Get block by height
  if (height) {
    const ix = await send(
      [
        getBlock() as unknown as (ix: Interaction) => Interaction,
        atBlockHeight(height) as unknown as (ix: Interaction) => Interaction,
      ],
      opts
    )
    return decode(ix)
  }

  // Get latest block
  const ix = await send(
    [getBlock(sealed) as unknown as (ix: Interaction) => Interaction],
    opts
  )
  return decode(ix)
}
