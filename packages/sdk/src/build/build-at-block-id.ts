import {
  isGetAccount,
  pipe,
  Ok as OkFn,
  Bad as BadFn,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {validator} from "./build-validator"
import {Interaction} from "@onflow/typedefs"

/**
 * A builder function that returns a partial interaction to a block at a specific block ID.
 *
 * Use with other interactions like 'fcl.getBlock()' to get a full interaction at the specified block ID.
 *
 * Block ID is SHA3-256 hash of the entire block payload. This hash is stored as an ID field on any block response object (ie. response from 'GetLatestBlock').
 *
 * @param id The ID of the block to execute the interaction at
 * @returns A partial interaction to be paired with another interaction such as 'fcl.getBlock()' or 'fcl.getAccount()'
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * // Get block by ID
 * await fcl.send([fcl.getBlock(), fcl.atBlockId("23232323232")]).then(fcl.decode);
 *
 * // Get account at specific block ID
 * await fcl.send([
 *   fcl.getAccount("0x1d007d755706c469"),
 *   fcl.atBlockId("9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3")
 * ]).then(fcl.decode);
 *
 * // Execute script at specific block
 * await fcl.send([
 *   fcl.script`
 *     access(all) fun main(): UFix64 {
 *       return getCurrentBlock().timestamp
 *     }
 *   `,
 *   fcl.atBlockId("a1b2c3d4e5f6")
 * ]).then(fcl.decode);
 * ```
 */
export function atBlockId(id: string): InteractionBuilderFn {
  return pipe([
    (ix: Interaction) => {
      ix.block.id = id
      return OkFn(ix)
    },
    validator(
      (ix: Interaction, {Ok, Bad}: {Ok: typeof OkFn; Bad: typeof BadFn}) => {
        if (isGetAccount(ix))
          return Bad(
            ix,
            "Unable to specify a block id with a Get Account interaction."
          )
        if (typeof ix.block.isSealed === "boolean")
          return Bad(ix, "Unable to specify both block id and isSealed.")
        if (ix.block.height)
          return Bad(ix, "Unable to specify both block id and block height.")
        return Ok(ix)
      }
    ),
  ])
}
