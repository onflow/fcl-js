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
 * Query the network for block by id, height or get the latest block.
 *
 * Block ID is SHA3-256 hash of the entire block payload. This hash is stored as an ID field on any block response object (ie. response from `GetLatestBlock`).
 *
 * Block height expresses the height of the block on the chain. The latest block height increases by one for every valid block produced.
 *
 * @param queryOptions Query parameters
 * @param queryOptions.sealed Whether to query for a sealed block
 * @param queryOptions.height Block height to query
 * @param queryOptions.id Block ID to query
 * @param opts Optional parameters
 * @returns A promise that resolves to a Block object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get latest block
 * const latestBlock = await fcl.block(); // Get the latest finalized block
 * const latestSealedBlock = await fcl.block({sealed: true}); // Get the latest sealed block
 *
 * // Get block by ID (uses builder function)
 * await fcl.send([fcl.getBlock(), fcl.atBlockId("23232323232")]).then(fcl.decode);
 *
 * // Get block at height (uses builder function)
 * await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode)
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
    return await send([getBlock(), atBlockHeight(height)], opts).then(decode)

  // Get latest block
  return await send([getBlock(sealed)], opts).then(decode)
}
