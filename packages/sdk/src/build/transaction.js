import {pipe} from "@qvvg/mario"
import {t7l} from "@qvvg/templar"
import {makeTransaction} from "@onflow/interaction"
import {put, update} from "@onflow/assigns"

const DEFAULT_COMPUTE_LIMIT = 10
const DEFAULT_SCRIPT_ACCOUNTS = []

// NOTE: nonces are changing, this will work for
//       the way the current emulator works
const nonce = () => Date.now()

const hammer = fallback => value => (value == null ? fallback : value)

export const transaction = (...args) =>
  pipe([
    makeTransaction,
    put("code", t7l(...args)),
    update("computeLimit", hammer(DEFAULT_COMPUTE_LIMIT)),
    update("scriptAccounts", hammer(DEFAULT_SCRIPT_ACCOUNTS)),
    update("nonce", hammer(nonce())),
  ])
