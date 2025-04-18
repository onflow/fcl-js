import {makePing} from "../interaction/interaction"
import {Interaction} from "../types"

/**
 * @description - A builder function that creates a ping interaction
 * @returns A function that processes an interaction object
 */
export function ping(): (ix: Interaction) => Interaction {
  return makePing
}
