import {pipe, makeParam} from "../interaction/interaction.js"

export function params(px = []) {
  return pipe(px.map(makeParam))
}

export function param(value, xform = null, key = null) {
  return {key, value, xform: null}
}
