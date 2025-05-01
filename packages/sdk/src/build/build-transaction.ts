import {
  pipe,
  put,
  Ok,
  makeTransaction,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {template} from "@onflow/util-template"

const DEFAULT_SCRIPT_ACCOUNTS: string[] = []
const DEFAULT_REF = ""

/**
 * @description A template builder to use a Cadence transaction for an interaction
 * @param args The arguments to pass
 * @returns A function that processes an interaction object
 */
export function transaction(
  ...args: [string | TemplateStringsArray, ...any[]]
): InteractionBuilderFn {
  return pipe([
    makeTransaction,
    put("ix.cadence", template(...args)),
    ix => {
      ix.message.refBlock = ix.message.refBlock || DEFAULT_REF
      ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS
      return Ok(ix)
    },
  ])
}
