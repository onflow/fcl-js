import {pipe} from "../interaction/interaction.js"
import {validator} from "./build-validator.js"

export function atBlockHeight(height) {
  return pipe([
    ix => {
      ix.block.height = height
      return ix
    },
    validator(ix => {
      if (typeof ix.block.isSealed === "boolean")
        throw new Error("Unable to specify both block height and isSealed.")
      if (ix.block.id)
        throw new Error("Unable to specify both block height and block id.")
      return ix
    }),
  ])
}
