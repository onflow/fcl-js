import {
  isGetAccount,
  pipe,
  Ok as OkFn,
  Bad as BadFn,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {validator} from "./build-validator"
import {Interaction} from "@onflow/typedefs"

export function atBlockId(id: string): InteractionBuilderFn {
  return pipe([
    (ix: Interaction) => {
      ix.block.id = id
      return OkFn(ix)
    },
    validator(
      (ix: Interaction, {Ok, Bad}: {Ok: typeof OkFn; Bad: typeof BadFn}) => {
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
      }
    ),
  ])
}
