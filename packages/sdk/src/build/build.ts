import {pipe, initInteraction} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

export function build(
  fns: ((x: Interaction) => Interaction | Promise<Interaction>)[] = []
): Promise<Interaction> {
  return pipe(initInteraction(), fns)
}
