import {
  pipe,
  Ok,
  makeGetBlock,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get the latest block.
 *
 * Use with 'fcl.atBlockId()' and 'fcl.atBlockHeight()' when building the interaction to get information for older blocks.
 *
 * Consider using the pre-built interaction 'fcl.block(options)' if you do not need to pair with any other builders.
 *
 * Block ID is SHA3-256 hash of the entire block payload. This hash is stored as an ID field on any block response object (ie. response from 'GetLatestBlock').
 *
 * Block height expresses the height of the block on the chain. The latest block height increases by one for every valid block produced.
 *
 * @param isSealed If the latest block should be sealed or not. See block states
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * const latestSealedBlock = await fcl.send([
 *   fcl.getBlock(true) // isSealed = true
 * ]).then(fcl.decode);
 */
export function getBlock(
  isSealed: boolean | null = null
): InteractionBuilderFn {
  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
