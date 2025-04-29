import {pipe, InteractionCallback} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {validator} from "./build-validator"

/**
 * @description A builder function that returns a partial interaction to a block at a specific height
 * @param height The height of the block to get
 * @returns A function that processes a partial interaction object
 */
export function atBlockHeight(height: number): InteractionCallback {
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
