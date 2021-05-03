import {
  TRANSACTION_DOMAIN_TAG,
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

const getDomainTag = signable => {
  return getMessage(signable).substring(0, TRANSACTION_DOMAIN_TAG.length)
}

const isExpectedMessage = signable => {
  return isPayer(signable)
    ? encodeOutsideMessage(getVoucher(signable)) === getMessage(signable)
    : encodeInsideMessage(getVoucher(signable)) === getMessage(signable)
}

const isTransaction = signable => {
  return getDomainTag(signable) === TRANSACTION_DOMAIN_TAG
}

export const validateSignableTransaction = signable => {
  invariant(
    isTransaction(signable),
    "Signable payload must be a valid transaction"
  )

  invariant(
    isExpectedMessage(signable),
    "Signable payload does not match expected"
  )

  return true
}
