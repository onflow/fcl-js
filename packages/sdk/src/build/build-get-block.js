import {pipe, Ok, makeGetBlock} from "../interaction/interaction.js"

export function getBlock(isSealed = null) {
  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    }
  ])
}
