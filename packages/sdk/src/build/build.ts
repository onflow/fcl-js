import {pipe, initInteraction} from "../interaction/interaction"
import {Interaction} from "../types"

export function build(
  fns: ((x: Interaction) => Interaction)[] = []
): Promise<Interaction> {
  return pipe(initInteraction(), fns)
}
