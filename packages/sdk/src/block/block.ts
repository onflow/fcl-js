import type {Block} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"
import {atBlockHeight} from "../build/build-at-block-height"
import {atBlockId} from "../build/build-at-block-id"
import {getBlock} from "../build/build-get-block"
import {decodeResponse as decode} from "../decode/decode"
import {send} from "../transport"

interface BlockQueryOptions {
  sealed?: boolean
  height?: number
  id?: string
}

/**
 * @description Returns the latest block (optionally sealed or not), by id, or by height
 * @param queryOptions Query parameters
 * @param queryOptions.sealed Whether to query for a sealed block
 * @param queryOptions.height Block height to query
 * @param queryOptions.id Block ID to query
 * @param opts Optional parameters
 * @returns A promise that resolves to a block response
 */
export async function block(
  {sealed = false, id, height}: BlockQueryOptions = {},
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
  if (id) return await send([getBlock(), atBlockId(id)], opts).then(decode)

  // Get block by height
  if (height)
    return send([getBlock(), atBlockHeight(height)], opts).then(decode)

  // Get latest block
  return send([getBlock(sealed)], opts).then(decode)
}
