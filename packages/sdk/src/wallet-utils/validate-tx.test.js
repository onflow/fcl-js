import {validateSignableTransaction} from "./"
import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode.js"

const MESSAGE = {
  cadence: "",
  computeLimit: 156,
  refBlock: "123",
  arguments: [],
  proposalKey: {address: "0x01", keyId: 1, sequenceNum: 123},
  payer: "0x01",
  authorizers: ["0x01"],
  payloadSigs: [
    {address: "0x01", keyId: 1, sig: "123"},
    {address: "0x01", keyId: 1, sig: "123"},
  ],
}

const encodedPayerMessage = encodeOutsideMessage(MESSAGE)

const encodedNonPayerMessage = encodeInsideMessage(MESSAGE)

const VOUCHER = {
  cadence: "",
  computeLimit: 156,
  refBlock: "123",
  arguments: [],
  proposalKey: {address: "0x01", keyId: 1, sequenceNum: 123},
  payer: "0x01",
  authorizers: ["0x01"],
  payloadSigs: [
    {address: "0x01", keyId: 1, sig: "123"},
    {address: "0x01", keyId: 1, sig: "123"},
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

describe("validate signable", () => {
  test("validate payer tx in signable", () => {
    const result = validateSignableTransaction(PAYER_SIGNABLE)
    expect(result).toBe(true)
  })

  test("validate nonpayer tx in signable", () => {
    const result = validateSignableTransaction(NON_PAYER_SIGNABLE)
    expect(result).toBe(true)
  })
})
