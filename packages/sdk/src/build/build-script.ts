import {pipe, Ok, put, makeScript} from "../interaction/interaction"
import {template} from "@onflow/util-template"

export function script(...args: Parameters<typeof template>) {
  return pipe([makeScript, put("ix.cadence", template(...args))])
}
