import {pipe} from "../interaction/interaction"
import {validator} from "./build-validator"

/**
 * @description - A builder function that returns a partial interaction to query the latest sealed block ("hard-finality").  Otherwise, the query will be executed against the latest executed block ("soft-finality").
 * @returns {Function} - A partial interaction object
 */
export function atBlockSealed() {
  return pipe([
    ix => {
      ix.block.isSealed = true
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
