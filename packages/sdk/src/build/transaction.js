import {pipe, put, Ok, makeTransaction} from "@onflow/interaction"
import {templar} from "@qvvg/templar"

const DEFAULT_COMPUTE_LIMIT = 10
const DEFAULT_SCRIPT_ACCOUNTS = []
const DEFUALT_REF = null

export function transaction(...args) {
  return pipe([
    makeTransaction,
    put("ix.cadence", templar(...args)),
    ix => {
      ix.message.computeLimit = ix.message.computeLimit || DEFAULT_COMPUTE_LIMIT
      ix.message.refBlock = ix.message.refBlock || DEFUALT_REF
      ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS
      return Ok(ix)
    },
  ])
}
