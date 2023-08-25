import {pipe, initInteraction} from "../interaction/interaction"

export function build(fns = []) {
  return pipe(initInteraction(), fns)
}
