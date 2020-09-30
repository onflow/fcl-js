import {pipe, Ok, put, makeScript} from "@onflow/interaction"
import {template} from "@onflow/util-template"

export function script(...args) {
  return pipe([
    makeScript,
    put("ix.cadence", template(...args))
  ])
}
