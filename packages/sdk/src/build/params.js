import {pipe, makeParam} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export function params(px = []) {
  return pipe(
    px.map((param, index) => {
      const p = isFn(param)
        ? { index, resolve: param }
        : { ...param, index}
    
      return makeParam(p)
    }
  ))
}

const identity = {
  asParam: v => v,
  asInjection: v => v,
}

export function param(value, xform = identity, key = null) {
  return {key, value, xform}
}
