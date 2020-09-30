import {pipe, makeArgument} from "@onflow/interaction"

export function args(ax = []) {
  return pipe(ax.map(makeArgument))
}

export function arg(value, xform) {
  return {value, xform}
}
