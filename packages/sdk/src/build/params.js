import {pipe, put} from "@onflow/interaction"

function toMap(kv = []) {
  return kv
    .filter(d => d.key != null)
    .reduce((acc, d) => ({...acc, [d.key]: d.value}), {})
}

export function params(px = []) {
  return pipe([put("ix.params", toMap(px))])
}

const identity = {
  asParam: v => v,
  asInjection: v => v,
}

export function param(value, xform = identity, key = null) {
  return {key, value, xform}
}
