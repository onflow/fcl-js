import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode"
import {invariant} from "@onflow/util-invariant"
import {Signable} from "./encode-signable"
const isPayer = (signable: Signable): boolean => {
  return signable.roles.payer
}

const getVoucher = (signable: Signable): any => {
  return signable.voucher
}

const getMessage = (signable: Signable): string => {
  return signable.message
}

const isExpectedMessage = (signable: Signable): boolean => {
  return isPayer(signable)
    ? encodeOutsideMessage(getVoucher(signable)) === getMessage(signable)
    : encodeInsideMessage(getVoucher(signable)) === getMessage(signable)
}

export const validateSignableTransaction = (signable: Signable): boolean => {
  invariant(isExpectedMessage(signable), "Signable payload must be transaction")

  return true
}
