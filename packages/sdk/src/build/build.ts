import {
  pipe,
  initInteraction,
  InteractionCallback,
} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

/**
 * @description A builder function that creates an interaction
 * @param fns The functions to apply to the interaction
 * @returns A promise of an interaction
 */
export function build(
  fns: (InteractionCallback | false)[] = []
): Promise<Interaction> {
  return pipe(initInteraction(), fns)
}
