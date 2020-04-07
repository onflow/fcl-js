import {pipe, put, Ok, update, makeTransaction} from "@onflow/interaction"
import {t7l} from "@qvvg/templar"

const DEFAULT_COMPUTE_LIMIT = 10
const DEFAULT_SCRIPT_ACCOUNTS = []
const DEFUALT_REF = null

// NOTE: nonces are changing, this will work for
//       the way the current emulator works
function nonce() {
  return Date.now()
}

function hammer(fallback) {
  return function(value) {
    return value == null ? fallback : value
  }
}

export function transaction(...args) {
  return pipe([
    makeTransaction,
    put("ix.code", t7l(...args)),
    ix => {
      ix.payload.limit = ix.payload.limit || DEFAULT_COMPUTE_LIMIT
      ix.payload.nonce = ix.payload.nonce || nonce()
      ix.payload.ref = ix.payload.ref || DEFUALT_REF
      return Ok(ix)
    },
    update("tx.authorizations", hammer(DEFAULT_SCRIPT_ACCOUNTS))
  ])
}
