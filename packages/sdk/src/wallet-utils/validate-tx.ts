import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode"
import {invariant} from "@onflow/util-invariant"

interface Signable {
  roles: {
    payer: boolean
  }
  voucher: any
  message: string
}

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

/**
 * Validates that a signable transaction is properly formed and contains the expected message.
 *
 * @param signable The signable object to validate
 * @returns True if the signable is valid, throws an error if invalid
 */
export const validateSignableTransaction = (signable: Signable): boolean => {
  invariant(isExpectedMessage(signable), "Signable payload must be transaction")

  return true
}
