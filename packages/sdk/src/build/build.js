import {pipe, initInteraction} from "../interaction/interaction.js"

export function build(fns = []) {
  return pipe(initInteraction(), fns)
}
