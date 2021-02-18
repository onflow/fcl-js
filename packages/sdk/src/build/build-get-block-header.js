import {pipe, Ok, makeGetBlockHeader} from "../interaction/interaction.js"

export function getBlockHeader(isSealed = null) {
  return pipe([
    makeGetBlockHeader,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    }
  ])
}
