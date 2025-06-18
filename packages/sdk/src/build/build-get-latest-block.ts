import {log} from "@onflow/util-logger"
import {
  pipe,
  Ok,
  makeGetBlock,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get the latest block
 *
 * This function creates an interaction to retrieve the latest block from the Flow blockchain.
 * You can specify whether to get the latest executed block (soft finality) or the latest sealed block (hard finality).
 *
 * @param isSealed Whether or not the block should be sealed (defaults to false for executed blocks)
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get the latest executed block (soft finality)
 * const latestBlock = await fcl.send([fcl.getLatestBlock()]).then(fcl.decode);
 * console.log("Latest block height:", latestBlock.height);
 * console.log("Block ID:", latestBlock.id);
 * console.log("Block timestamp:", latestBlock.timestamp);
 *
 * // Get the latest sealed block (hard finality)
 * const sealedBlock = await fcl.send([fcl.getLatestBlock(true)]).then(fcl.decode);
 * console.log("Latest sealed block height:", sealedBlock.height);
 *
 * // Use in combination with other builders
 * const blockInfo = await fcl.send([
 *   fcl.getLatestBlock(),
 *   // Additional builders can be added here
 * ]).then(fcl.decode);
 */
export function getLatestBlock(
  isSealed: boolean = false
): InteractionBuilderFn {
  log.deprecate({
    pkg: "FCL/SDK",
    subject: "The getLatestBlock builder",
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0006-deprecate-get-latest-block-builder",
  })

  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed ?? false
      return Ok(ix)
    },
  ])
}
