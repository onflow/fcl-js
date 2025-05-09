import {makePing, InteractionBuilderFn} from "../interaction/interaction"

/**
 * @description A builder function that creates a ping interaction
 * @returns A function that processes an interaction object
 */
export function ping(): InteractionBuilderFn {
  return makePing
}
