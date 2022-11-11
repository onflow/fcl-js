import {pipe, interaction} from "../interaction/interaction"

export function build(fns: Function[] = []) {
  return pipe(interaction(), fns)
}
