import {pipe, interaction} from "@onflow/interaction"

export function build(fns = []) {
  return pipe(interaction(), fns)
}
