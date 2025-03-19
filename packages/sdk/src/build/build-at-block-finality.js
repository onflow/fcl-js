import {pipe} from "../interaction/interaction"
import {validator} from "./build-validator"

/**
 * @description - A builder function that returns a partial interaction to a block at a specific finality
 * @param {boolean} isSealed - A boolean value indicating whether the block is sealed ("hard-finality")
 * @returns {Function} - A partial interaction object
 */
export function atBlockFinality(isSealed) {
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
