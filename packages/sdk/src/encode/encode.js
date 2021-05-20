import { encode } from '@onflow/rlp';

export const encodeTransactionPayload = tx => prependTransactionDomainTag(rlpEncode(preparePayload(tx)))
export const encodeTransactionEnvelope = tx => prependTransactionDomainTag(rlpEncode(prepareEnvelope(tx)))

const rightPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padEnd(pad * 2, 0), "hex")

const leftPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padStart(pad * 2, 0), "hex")

const TRANSACTION_DOMAIN_TAG = rightPaddedHexBuffer(Buffer.from("FLOW-V0.0-transaction").toString("hex"), 32).toString("hex")
const prependTransactionDomainTag = tx => TRANSACTION_DOMAIN_TAG + tx

const addressBuffer = addr => leftPaddedHexBuffer(addr, 8)

const blockBuffer = block => leftPaddedHexBuffer(block, 32)

const argumentToString = arg => Buffer.from(JSON.stringify(arg), "utf8")

const scriptBuffer = script => Buffer.from(script, "utf8")
const signatureBuffer = signature => Buffer.from(signature, "hex")

const rlpEncode = v => {
  return encode(v).toString("hex")
}

const preparePayload = tx => {
  validatePayload(tx)

  return [
    scriptBuffer(tx.cadence),
    tx.arguments.map(argumentToString),
    blockBuffer(tx.refBlock),
    tx.computeLimit,
    addressBuffer(tx.proposalKey.address),
    tx.proposalKey.keyId,
    tx.proposalKey.sequenceNum,
    addressBuffer(tx.payer),
    tx.authorizers.map(addressBuffer),
  ]
}

const prepareEnvelope = tx => {
  validateEnvelope(tx)

  return [preparePayload(tx), preparePayloadSignatures(tx)]
}

const preparePayloadSignatures = tx => {
  const signers = collectSigners(tx)

  return tx.payloadSigs
    .map(sig => {
      return {
        signerIndex: signers.get(sig.address),
        keyId: sig.keyId,
        sig: sig.sig,
      }
    })
    .sort((a, b) => {
      if (a.signerIndex > b.signerIndex) return 1
      if (a.signerIndex < b.signerIndex) return -1

      if (a.keyId > b.keyId) return 1
      if (a.keyId < b.keyId) return -1
    })
    .map(sig => {
      return [sig.signerIndex, sig.keyId, signatureBuffer(sig.sig)]
    })
}

const collectSigners = tx => {
  const signers = new Map()
  let i = 0

  const addSigner = addr => {
    if (!signers.has(addr)) {
      signers.set(addr, i)
      i++
    }
  }

  addSigner(tx.proposalKey.address)
  addSigner(tx.payer)
  tx.authorizers.forEach(addSigner)

  return signers
}

const validatePayload = tx => {
  payloadFields.forEach(field => checkField(tx, field))
  proposalKeyFields.forEach(field =>
    checkField(tx.proposalKey, field, "proposalKey")
  )
}

const validateEnvelope = tx => {
  envelopeFields.forEach(field => checkField(tx, field))
  tx.payloadSigs.forEach((sig, index) => {
    payloadSigFields.forEach(field =>
      checkField(sig, field, "payloadSigs", index)
    )
  })
}

const isNumber = v => typeof v === "number"
const isString = v => typeof v === "string"
const isObject = v => v !== null && typeof v === "object"
const isArray = v => isObject(v) && v instanceof Array

const payloadFields = [
  {name: "cadence", check: isString},
  {name: "arguments", check: isArray},
  {name: "refBlock", check: isString, defaultVal: "0"},
  {name: "computeLimit", check: isNumber},
  {name: "proposalKey", check: isObject},
  {name: "payer", check: isString},
  {name: "authorizers", check: isArray},
]

const proposalKeyFields = [
  {name: "address", check: isString},
  {name: "keyId", check: isNumber},
  {name: "sequenceNum", check: isNumber},
]

const envelopeFields = [{name: "payloadSigs", check: isArray}]

const payloadSigFields = [
  {name: "address", check: isString},
  {name: "keyId", check: isNumber},
  {name: "sig", check: isString},
]

const checkField = (obj, field, base, index) => {
  const {name, check, defaultVal} = field
  if (obj[name] == null && defaultVal != null) obj[name] = defaultVal
  if (obj[name] == null) throw missingFieldError(name, base, index)
  if (!check(obj[name])) throw invalidFieldError(name, base, index)
}

const printFieldName = (field, base, index) => {
  if (!!base)
    return index == null ? `${base}.${field}` : `${base}.${index}.${field}`
  return field
}

const missingFieldError = (field, base, index) =>
  new Error(`Missing field ${printFieldName(field, base, index)}`)
const invalidFieldError = (field, base, index) =>
  new Error(`Invalid field ${printFieldName(field, base, index)}`)
