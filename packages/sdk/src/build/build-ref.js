import {pipe, Ok} from "../interaction/interaction.js"

export function ref(refBlock) {
  return pipe([
    ix => {
      ix.message.refBlock = refBlock
      return Ok(ix)
    }
  ])
}
