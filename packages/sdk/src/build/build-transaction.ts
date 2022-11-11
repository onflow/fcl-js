import {pipe, put, Ok, makeTransaction} from "../interaction/interaction"
import {template} from "@onflow/util-template"

const DEFAULT_SCRIPT_ACCOUNTS = []
const DEFUALT_REF = null

export function transaction(...args: Parameters<typeof template>) {
  return pipe([
    makeTransaction,
    put("ix.cadence", template(...args)),
    ix => {
      ix.message.refBlock = ix.message.refBlock || DEFUALT_REF
      ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS
      return Ok(ix)
    },
  ])
}
