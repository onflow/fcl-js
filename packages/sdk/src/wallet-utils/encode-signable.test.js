import {encodeMessageFromSignable, UnableToDetermineMessageEncodingTypeForSignerAddress} from "./encode-signable.js"
import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode.js"

const MESSAGE = {
  cadence: "transaction()...",
  computeLimit: 156,
  refBlock: "123",
  arguments: [],
  proposalKey: {address: "02", keyId: 1, sequenceNum: 123},
  payer: "01",
  authorizers: ["02"],
  payloadSigs: [
    {address: "02", keyId: 1, sig: "123"},
  ],
}

const encodedPayerMessage = encodeOutsideMessage(MESSAGE)
const encodedNonPayerMessage = encodeInsideMessage(MESSAGE)

const VOUCHER = {
  cadence: "transaction()...",
  computeLimit: 156,
  refBlock: "123",
  arguments: [],
  proposalKey: {address: "0x02", keyId: 1, sequenceNum: 123},
  payer: "0x01",
  authorizers: ["0x02"],
  payloadSigs: [
    {address: "0x02", keyId: 1, sig: "123"},
  ],
}

const PAYER_SIGNABLE = {
  f_type: "Signable",
  message: encodedPayerMessage,
  roles: {proposer: false, authorizer: false, payer: true, param: false},
  interaction: {
    tag: "TRANSACTION",
  },
  voucher: VOUCHER,
}

const NON_PAYER_SIGNABLE = {
  f_type: "Signable",
  message: encodedNonPayerMessage,
  roles: {proposer: true, authorizer: false, payer: false, param: false},
  interaction: {
    tag: "TRANSACTION",
  },
  voucher: VOUCHER,
}

describe("encode signable", () => {
  test("encode signable for payer included in signable", () => {
    const message = encodeMessageFromSignable(PAYER_SIGNABLE, "0x01")

    expect(message).toBe(PAYER_SIGNABLE.message)
  })

  test("encode signable for non-payer included in signable", () => {
    const message = encodeMessageFromSignable(NON_PAYER_SIGNABLE, "0x02")

    expect(message).toBe(NON_PAYER_SIGNABLE.message)
  })

  test("encode signable for address NOT included in signable", () => {
    const runTest = () => {
        return encodeMessageFromSignable(NON_PAYER_SIGNABLE, "0x09")
    }

    expect(runTest).toThrow(UnableToDetermineMessageEncodingTypeForSignerAddress)
  })
})
