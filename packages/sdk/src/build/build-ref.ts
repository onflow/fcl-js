import {Interaction} from "@onflow/typedefs"
import {pipe, Ok} from "../interaction/interaction"

/**
 * @description - A builder function that sets the reference block for a transaction
 * @param refBlock - The reference block ID
 * @returns A function that processes an interaction object
 */
export function ref(
  refBlock: string
): (ix: Interaction) => Promise<Interaction> {
  return pipe([
    ix => {
      ix.message.refBlock = refBlock
      return Ok(ix)
    },
  ])
}
