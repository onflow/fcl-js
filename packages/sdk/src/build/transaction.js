import {pipe, put, update, makeTransaction} from "@onflow/interaction"
import {t7l} from "@qvvg/templar"

const DEFAULT_COMPUTE_LIMIT = 10
const DEFAULT_SCRIPT_ACCOUNTS = []

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
    update("tx.limit", hammer(DEFAULT_COMPUTE_LIMIT)),
    update("tx.authorizations", hammer(DEFAULT_SCRIPT_ACCOUNTS)),
    update("tx.nonce", hammer(nonce())),
  ])
}
