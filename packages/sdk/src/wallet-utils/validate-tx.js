import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode.js"
import {invariant} from "@onflow/util-invariant"

const isPayer = signable => {
  return signable.roles.payer
}
const getVoucher = signable => {
  return signable.voucher
}
const getMessage = signable => {
  return signable.message
}

const isExpectedMessage = signable => {
  return isPayer(signable)
    ? encodeOutsideMessage(getVoucher(signable)) === getMessage(signable)
    : encodeInsideMessage(getVoucher(signable)) === getMessage(signable)
}

export const validateSignableTransaction = signable => {
  invariant(isExpectedMessage(signable), "Signable payload must be transaction")

  return true
}
