import {pipe, Ok} from "../interaction/interaction.js"
import {validator} from "./build-validator.js"

export function atBlockHeight(height) {
  return pipe([
    ix => {
      ix.block.height = height
      return Ok(ix)
    },
    validator((ix, {Ok, Bad}) => {
      if (typeof ix.block.isSealed === "boolean") return Bad(ix, "Unable to specify both block height and isSealed.")
      if (ix.block.id) return Bad(ix, "Unable to specify both block height and block id.")
      return Ok(ix)
    }),
  ])
}
