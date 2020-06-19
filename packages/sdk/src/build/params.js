import {pipe, makeParam} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export function params(px = []) {
  return pipe(
    px.map(param => {
      const p = isFn(param)
        ? { resolve: param }
        : param
    
      return makeParam(p)
    }
  ))
}

const identity = {
  asArgument: v => v,
  asInjection: v => v,
}

export function param(value, xform = identity, key = null) {
  return {key, value, xform}
}
