import {pipe, makeArgument} from "../interaction/interaction.js"

export function args(ax = []) {
  return pipe(ax.map(makeArgument))
}

export function arg(value, xform) {
  return {value, xform}
}
