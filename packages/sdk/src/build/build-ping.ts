import {makePing} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

/**
 * @description - A builder function that creates a ping interaction
 * @returns A function that processes an interaction object
 */
export function ping(): (ix: Interaction) => Interaction {
  return makePing
}
