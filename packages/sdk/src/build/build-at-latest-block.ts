import {pipe, InteractionBuilderFn} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {validator} from "./build-validator"

/**
 * A builder function that returns a partial interaction to query the latest block with the given finality state.
 *
 * Use with other interactions like 'fcl.getBlock()' to get the latest block information.
 * Block finality determines whether you get the latest executed block or the latest sealed block.
 *
 * - Executed blocks (soft-finality): Latest block that has been executed but may not be final
 * - Sealed blocks (hard-finality): Latest block that has been sealed and is considered final
 *
 * @param isSealed Block finality state, defaults to latest executed block ("soft-finality"), set to true for sealed blocks ("hard-finality")
 * @returns A function that processes a partial interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get latest executed block (soft finality)
 * await fcl.send([fcl.getBlock(), fcl.atLatestBlock()]).then(fcl.decode);
 *
 * // Get latest sealed block (hard finality)
 * await fcl.send([fcl.getBlock(), fcl.atLatestBlock(true)]).then(fcl.decode);
 *
 * // Get account from latest sealed block
 * await fcl.send([
 *   fcl.getAccount("0x1d007d755706c469"),
 *   fcl.atLatestBlock(true)
 * ]).then(fcl.decode);
 *
 * // Execute script against latest executed block
 * await fcl.send([
 *   fcl.script`
 *     access(all) fun main(): UFix64 {
 *       return getCurrentBlock().height
 *     }
 *   `,
 *   fcl.atLatestBlock()
 * ]).then(fcl.decode);
 */
export function atLatestBlock(isSealed = false): InteractionBuilderFn {
  return pipe([
    (ix: Interaction) => {
      ix.block.isSealed = isSealed
      return ix
    },
    validator((ix: Interaction) => {
      if (ix.block.id)
        throw new Error("Unable to specify both block finality and block id.")
      if (ix.block.height)
        throw new Error(
          "Unable to specify both block finality and block height."
        )
      return ix
    }),
  ])
}
