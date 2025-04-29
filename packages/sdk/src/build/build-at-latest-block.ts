import {pipe, InteractionCallback} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {validator} from "./build-validator"

/**
 * @description A builder function that returns a partial interaction to query the latest block with the given finality state
 * @param isSealed Block finality state, defaults to latest executed block ("soft-finality"), set to true for sealed blocks ("hard-finality")
 * @returns A function that processes a partial interaction object
 */
export function atLatestBlock(isSealed = false): InteractionCallback {
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
