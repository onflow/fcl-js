import {Interaction} from "@onflow/typedefs"
import {pipe, Ok, makeGetBlock} from "../interaction/interaction"

/**
 * @description - A builder function that returns the interaction to get the latest block
 * @param isSealed - Whether or not the block should be sealed
 * @returns A function that processes an interaction object
 */
export function getBlock(
  isSealed: boolean | null = null
): (ix: Interaction) => Promise<Interaction> {
  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
