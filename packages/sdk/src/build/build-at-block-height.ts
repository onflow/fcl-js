import {pipe, InteractionBuilderFn} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {validator} from "./build-validator"

/**
 * A builder function that returns a partial interaction to a block at a specific height.
 *
 * Use with other interactions like 'fcl.getBlock()' to get a full interaction at the specified block height.
 *
 * Block height expresses the height of the block on the chain. The latest block height increases by one for every valid block produced.
 *
 * @param height The height of the block to execute the interaction at
 * @returns A partial interaction to be paired with another interaction such as 'fcl.getBlock()' or 'fcl.getAccount()'
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * // Get block at specific height
 * await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode);
 *
 * // Get account at specific block height
 * await fcl.send([
 *   fcl.getAccount("0x1d007d755706c469"),
 *   fcl.atBlockHeight(12345)
 * ]).then(fcl.decode);
 *
 * // Execute script at specific block height
 * await fcl.send([
 *   fcl.script`
 *     access(all) fun main(): UFix64 {
 *       return getCurrentBlock().height
 *     }
 *   `,
 *   fcl.atBlockHeight(100)
 * ]).then(fcl.decode);
 * ```
 */
export function atBlockHeight(height: number): InteractionBuilderFn {
  return pipe([
    (ix: Interaction) => {
      ix.block.height = height
      return ix
    },
    validator((ix: Interaction) => {
      if (typeof ix.block.isSealed === "boolean")
        throw new Error("Unable to specify both block height and isSealed.")
      if (ix.block.id)
        throw new Error("Unable to specify both block height and block id.")
      return ix
    }),
  ])
}
