import {Interaction} from "../types"

/**
 * @description - A builder function that sets the compute limit for a transaction
 * @param limit - The compute limit to set
 * @returns A function that processes an interaction object
 */
export function limit(limit: number): (ix: Interaction) => Interaction {
  return ix => {
    ix.message.computeLimit = limit
    return ix
  }
}
