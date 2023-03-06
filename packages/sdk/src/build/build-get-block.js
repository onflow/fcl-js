import {pipe, Ok, makeGetBlock} from "../interaction/interaction.js"

/**
 * @description - A builder function that returns the interaction to get the latest block
 * @param {boolean} [isSealed] - Whether or not the block should be sealed
 * @returns {object} - An interaction object
 */
export function getBlock(isSealed = null) {
  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
