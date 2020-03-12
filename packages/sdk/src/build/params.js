import {pipe} from "@qvvg/mario"
import {put} from "@onflow/assigns"

const toMap = (kv = []) =>
  kv.reduce((acc, d) => ({...acc, [d.key]: d.value}), {})

export const params = (px = []) =>
  pipe([
    put("params", toMap(px))
  ])

export const param = (key, value, _type = null) => {
  return {key, value}
}
