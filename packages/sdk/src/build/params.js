import {pipe, put} from "@onflow/interaction"

function toMap(kv = []) {
  return kv.reduce((acc, d) => ({...acc, [d.key]: d.value}), {})
}

export function params(px = []) {
  return pipe([put("ix.params", toMap(px))])
}

export function param(key, value, _type = null) {
  return {key, value}
}
