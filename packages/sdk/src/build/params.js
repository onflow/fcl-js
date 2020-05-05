import {pipe, makeParam} from "@onflow/interaction"

export function params(px = []) {
  return pipe(px.map(makeParam))
}

const identity = {
  asParam: v => v,
  asInjection: v => v,
}

export function param(value, xform = identity, key = null) {
  return {key, value, xform}
}
