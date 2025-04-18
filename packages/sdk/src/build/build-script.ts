import {Interaction} from "../types"
import {pipe, put, makeScript} from "../interaction/interaction"
import {template} from "@onflow/util-template"

/**
 * @description - A builder function that creates a script interaction
 * @returns A function that processes an interaction object
 */
export function script(
  ...args: [
    string | TemplateStringsArray | ((x?: unknown) => string),
    ...unknown[],
  ]
): (ix: Interaction) => Promise<Interaction> {
  return pipe([makeScript, put("ix.cadence", template(...args))])
}
