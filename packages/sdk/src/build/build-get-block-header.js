import {pipe, Ok, makeGetBlockHeader} from "../interaction/interaction"

/**
 * @description - A builder function that returns the interaction to get a block header
 * @param {boolean} [isSealed] - Whether or not the block should be sealed
 * @returns {Function} - An interaction object
 */
export function getBlockHeader(isSealed = null) {
  return pipe([
    makeGetBlockHeader,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
