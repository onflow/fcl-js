import {
  pipe,
  Ok,
  makeGetBlockHeader,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get a block header.
 *
 * A block header contains metadata about a block without the full transaction details, making it more
 * lightweight than fetching the entire block. This is useful when you only need block metadata like
 * timestamp, height, parent hash, etc.
 *
 * Use with 'fcl.atBlockId()' and 'fcl.atBlockHeight()' when building the interaction to get headers for specific blocks.
 *
 * @param isSealed Block finality state, true for sealed blocks, false for finalized blocks, null for latest
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get latest sealed block header
 * const sealedHeader = await fcl.send([
 *   fcl.getBlockHeader(true)
 * ]).then(fcl.decode);
 *
 * console.log("Block height:", sealedHeader.height);
 * console.log("Block timestamp:", sealedHeader.timestamp);
 * console.log("Parent block ID:", sealedHeader.parentId);
 *
 * // Get header for specific block
 * const blockHeader = await fcl.send([
 *   fcl.getBlockHeader(),
 *   fcl.atBlockHeight(12345)
 * ]).then(fcl.decode);
 *
 * // Get latest finalized block header
 * const finalizedHeader = await fcl.send([
 *   fcl.getBlockHeader(false)
 * ]).then(fcl.decode);
 */
export function getBlockHeader(
  isSealed: boolean | null = null
): InteractionBuilderFn {
  return pipe([
    makeGetBlockHeader,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
