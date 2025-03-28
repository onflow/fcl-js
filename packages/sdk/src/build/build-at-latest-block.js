import {pipe} from "../interaction/interaction"
import {validator} from "./build-validator"

/**
 * @description - A builder function that returns a partial interaction to query the latest block with the given finality state
 * @param {boolean} [isSealed=false] - Block finality state, defaults to latest executed block ("soft-finality"), set to true for sealed blocks ("hard-finality")
 * @returns {Function} - A partial interaction object
 */
export function atLatestBlock(isSealed = false) {
  return pipe([
    ix => {
      ix.block.isSealed = isSealed
      return ix
    },
    validator(ix => {
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
