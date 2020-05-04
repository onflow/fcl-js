import {pipe, put, Ok, update, makeTransaction} from "@onflow/interaction"
import {t7l} from "@qvvg/templar"

const DEFAULT_COMPUTE_LIMIT = 10
const DEFAULT_SCRIPT_ACCOUNTS = []
const DEFUALT_REF = null

function hammer(fallback) {
  return function(value) {
    return value == null ? fallback : value
  }
}

export function transaction(...args) {
  return pipe([
    makeTransaction,
    put("ix.cadence", t7l(...args)),
    ix => {
      ix.message.computeLimit = ix.message.computeLimit || DEFAULT_COMPUTE_LIMIT
      ix.message.refBlock = ix.message.refBlock || DEFUALT_REF
      ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS
      return Ok(ix)
    },
  ])
}
