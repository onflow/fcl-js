import {pipe, Ok, put, makeScript} from "@onflow/interaction"
import {templar} from "@qvvg/templar"

export function script(...args) {
  return pipe([makeScript, put("ix.cadence", templar(...args))])
}
