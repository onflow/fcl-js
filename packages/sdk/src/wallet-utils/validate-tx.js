import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode.js"
import {invariant} from "@onflow/util-invariant"
import {TRANSACTION} from "../interaction/interaction"

const validateSignableTransaction = signable => {
  invariant(
    signable.interaction.tag === TRANSACTION,
    "Signable payload must be transaction"
  )

  return signable.roles.payer
    ? encodeOutsideMessage(signable.voucher) === signable.message
    : encodeInsideMessage(signable.voucher) === signable.message
}

export default validateSignableTransaction
