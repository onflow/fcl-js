import {pipe, Ok} from "../interaction/interaction.js"

export function limit(computeLimit) {
  return pipe([
    ix => {
      ix.message.computeLimit = computeLimit
      return Ok(ix)
    }
  ])
}
