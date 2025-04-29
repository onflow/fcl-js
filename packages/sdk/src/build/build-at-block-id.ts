import {
  isGetAccount,
  pipe,
  Ok,
  InteractionCallback,
} from "../interaction/interaction"
import {validator} from "./build-validator"
import {Interaction} from "@onflow/typedefs"

export function atBlockId(id: string): InteractionCallback {
  return pipe([
    (ix: Interaction) => {
      ix.block.id = id
      return Ok(ix)
    },
    validator((ix: Interaction, {Ok, Bad}: any) => {
      if (isGetAccount(ix))
        return Bad(
          ix,
          "Unable to specify a block id with a Get Account interaction."
        )
      if (typeof ix.block.isSealed === "boolean")
        return Bad(ix, "Unable to specify both block id and isSealed.")
      if (ix.block.height)
        return Bad(ix, "Unable to specify both block id and block height.")
      return Ok(ix)
    }),
  ])
}
