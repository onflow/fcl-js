import {pipe, Ok, put, makeScript} from "@onflow/interaction"
import {t7l} from "@qvvg/templar"

export function script(...args) {
  return pipe([makeScript,
    put("ix.cadence", t7l(...args)),
  ])
}
