import { SHA3 } from "sha3"
import { encode } from "@onflow/rlp"
import { sansPrefix } from "@onflow/util-address"

export const encodeTransactionPayload = tx => prependTransactionDomainTag(rlpEncode(preparePayload(tx)))
export const encodeTransactionEnvelope = tx => prependTransactionDomainTag(rlpEncode(prepareEnvelope(tx)))
export const encodeTxIdFromVoucher = voucher => sha3_256(rlpEncode(prepareVoucher(voucher)))

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

const sha3_256 = msg => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msg, "hex"))
  return sha.digest().toString("hex")
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

const prepareVoucher = voucher => {
  validateVoucher(voucher)

  const signers = collectSigners(voucher)

  const prepareSigs = sigs => {
    return sigs.map(({ address, keyId, sig }) => {
      return { signerIndex: signers.get(address), keyId, sig }
    }).sort((a, b) => {
      if (a.signerIndex > b.signerIndex) return 1
      if (a.signerIndex < b.signerIndex) return -1
      if (a.keyId > b.keyId) return 1
      if (a.keyId < b.keyId) return -1
    }).map(sig => {
      return [sig.signerIndex, sig.keyId, signatureBuffer(sig.sig)]
    })
  }

  return [
    [
      scriptBuffer(voucher.cadence),
      voucher.arguments.map(argumentToString),
      blockBuffer(voucher.refBlock),
      voucher.computeLimit,
      addressBuffer(sansPrefix(voucher.proposalKey.address)),
      voucher.proposalKey.keyId,
      voucher.proposalKey.sequenceNum,
      addressBuffer(sansPrefix(voucher.payer)),
      voucher.authorizers.map(authorizer => addressBuffer(sansPrefix(authorizer))),
    ],
    prepareSigs(voucher.payloadSigs),
    prepareSigs(voucher.envelopeSigs),
  ]
}

const validatePayload = tx => {
  payloadFields.forEach(field => checkField(tx, field))
  proposalKeyFields.forEach(field =>
    checkField(tx.proposalKey, field, "proposalKey")
  )
}

const validateEnvelope = tx => {
  payloadSigsFields.forEach(field => checkField(tx, field))
  tx.payloadSigs.forEach((sig, index) => {
    payloadSigFields.forEach(field =>
      checkField(sig, field, "payloadSigs", index)
    )
  })
}

const validateVoucher = voucher => {
  payloadFields.forEach(field => checkField(voucher, field))
  proposalKeyFields.forEach(field =>
    checkField(voucher.proposalKey, field, "proposalKey")
  )
  payloadSigsFields.forEach(field => checkField(voucher, field))
  voucher.payloadSigs.forEach((sig, index) => {
    payloadSigFields.forEach(field =>
      checkField(sig, field, "payloadSigs", index)
    )
  })
  envelopeSigsFields.forEach(field => checkField(voucher, field))
  voucher.envelopeSigs.forEach((sig, index) => {
    envelopeSigFields.forEach(field =>
      checkField(sig, field, "envelopeSigs", index)
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

const payloadSigsFields = [{name: "payloadSigs", check: isArray}]

const payloadSigFields = [
  {name: "address", check: isString},
  {name: "keyId", check: isNumber},
  {name: "sig", check: isString},
]

const envelopeSigsFields = [{name: "envelopeSigs", check: isArray}]

const envelopeSigFields = [
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
