import {pipe, makeArgument} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export function _arguments(ag = []) {
  return pipe(
    ag.map(arg => {
      const a = isFn(arg)
        ? { resolve: arg }
        : arg
    
      return makeArgument(a)
    }
  ))
}

const identity = {
  asArgument: v => v,
  asInjection: v => v,
}

export function _argument(value, xform = identity) {
  return {value, xform}
}
