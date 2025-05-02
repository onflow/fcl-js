import {
  pipe,
  Ok,
  makeGetBlockHeader,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get a block header
 * @param isSealed Whether or not the block should be sealed
 * @returns A function that processes an interaction object
 */
export function getBlockHeader(
  isSealed: boolean | null = null
): InteractionBuilderFn {
  return pipe([
    makeGetBlockHeader,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
