import {InteractionCallback} from "../interaction/interaction"

/**
 * @description A builder function that sets the compute limit for a transaction
 * @param limit The compute limit to set
 * @returns A function that processes an interaction object
 */
export function limit(limit: number): InteractionCallback {
  return ix => {
    ix.message.computeLimit = limit
    return ix
  }
}
