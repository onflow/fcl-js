import {pipe, interaction} from "../interaction/interaction.js"

export function build(fns = []) {
  return pipe(interaction(), fns)
}
