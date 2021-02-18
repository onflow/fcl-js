import {isGetAccount, pipe, Ok} from "../interaction/interaction.js"
import {validator} from "./build-validator.js"

export function atBlockId(id) {
  return pipe([
    ix => {
      ix.block.id = id
      return Ok(ix)
    },
    validator((ix, {Ok, Bad}) => {
      if (isGetAccount(ix)) return Bad(ix, "Unable to specify a block id with a Get Account interaction.")
      if (typeof ix.block.isSealed === "boolean") return Bad(ix, "Unable to specify both block id and isSealed.")
      if (ix.block.height) return Bad(ix, "Unable to specify both block id and block height.")
      return Ok(ix)
    }),
  ])
}
