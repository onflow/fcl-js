import {SHA3} from "sha3"
import {encode as rlpEncode, Buffer} from "@onflow/rlp"

const arrayifyHex = (hex: string) => hex.replace(/^0x/, "")
const leftPadHex = (hex: string, byteLength: number) =>
  arrayifyHex(hex).padStart(byteLength * 2, "0")
const rightPadHex = (hex: string, byteLength: number) =>
  arrayifyHex(hex).padEnd(byteLength * 2, "0")

const utf8ToBytes = (s: string) => new TextEncoder().encode(s)
export const bytesToHex = (b: Uint8Array) =>
  Array.from(b)
    .map(x => x.toString(16).padStart(2, "0"))
    .join("")
export const hexToBytes = (hex: string) =>
  new Uint8Array(
    (arrayifyHex(hex).match(/.{1,2}/g) || []).map(b => parseInt(b, 16))
  )

const encodeRlpBytes = (items: any[]): Uint8Array =>
  rlpEncode(items) as unknown as Uint8Array

export const TRANSACTION_DOMAIN_TAG = rightPadHex(
  bytesToHex(utf8ToBytes("FLOW-V0.0-transaction")),
  32
)
export const ACCOUNT_PROOF_DOMAIN_TAG = rightPadHex(
  bytesToHex(utf8ToBytes("FCL-ACCOUNT-PROOF-V0.0")),
  32
)

export type Voucher = {
  cadence: string
  refBlock: string
  computeLimit: number
  arguments: any[]
  proposalKey: {address: string; keyId: number; sequenceNum: number}
  payer: string
  authorizers: string[]
  payloadSigs: {
    address: string
    keyId: number
    sig: string
    extensionData?: string
  }[]
  envelopeSigs: {
    address: string
    keyId: number
    sig: string
    extensionData?: string
  }[]
}

const addressBytes = (addr: string) => hexToBytes(leftPadHex(addr, 8))
const blockBytes = (block: string) => hexToBytes(leftPadHex(block, 32))
const argBytes = (arg: any) => utf8ToBytes(JSON.stringify(arg))
const scriptBytes = (script: string) => utf8ToBytes(script)
const sigBytes = (sig: string) => hexToBytes(arrayifyHex(sig))
const sigExtBytes = (ext?: string) => {
  if (ext == null) return undefined as unknown as Uint8Array
  const hex = arrayifyHex(ext)
  return hexToBytes(hex)
}

const collectSigners = (v: Voucher) => {
  const map = new Map<string, number>()
  let i = 0
  const add = (a: string) => {
    const key = arrayifyHex(a)
    if (!map.has(key)) {
      map.set(key, i++)
    }
  }
  if (v.proposalKey.address) add(v.proposalKey.address)
  add(v.payer)
  v.authorizers.forEach(add)
  return map
}

const preparePayload = (v: Voucher) => [
  scriptBytes(v.cadence || ""),
  v.arguments.map(argBytes),
  blockBytes(v.refBlock || "0"),
  v.computeLimit,
  addressBytes(arrayifyHex(v.proposalKey.address)),
  v.proposalKey.keyId,
  v.proposalKey.sequenceNum,
  addressBytes(arrayifyHex(v.payer)),
  v.authorizers.map(a => addressBytes(arrayifyHex(a))),
]

const prepareSigs = (v: Voucher, sigs: Voucher["payloadSigs"]) => {
  const signers = collectSigners(v)
  return sigs
    .map(s => ({
      signerIndex: signers.get(arrayifyHex(s.address)) || 0,
      keyId: s.keyId,
      sig: s.sig,
      sigExt: sigExtBytes(s.extensionData),
    }))
    .sort((a, b) =>
      a.signerIndex === b.signerIndex
        ? a.keyId - b.keyId
        : a.signerIndex - b.signerIndex
    )
    .map(s => {
      const base: any[] = [s.signerIndex, s.keyId, sigBytes(s.sig)]
      if (s.sigExt != null) base.push(s.sigExt)
      return base
    })
}

export const encodeTransactionPayload = (v: Voucher) =>
  TRANSACTION_DOMAIN_TAG + bytesToHex(encodeRlpBytes(preparePayload(v)))
export const encodeTransactionEnvelope = (v: Voucher) =>
  TRANSACTION_DOMAIN_TAG +
  bytesToHex(encodeRlpBytes([preparePayload(v), prepareSigs(v, v.payloadSigs)]))

export type Signable = {voucher: Voucher}

export const encodeMessageFromSignable = (
  signable: Signable,
  signerAddress: string
): string => {
  const withPrefix = (a: string) => (a.startsWith("0x") ? a : "0x" + a)
  const payloadSet = new Set<string>([
    ...signable.voucher.authorizers.map(withPrefix),
    withPrefix(signable.voucher.proposalKey.address),
  ])
  payloadSet.delete(withPrefix(signable.voucher.payer))
  const isPayload = payloadSet.has(withPrefix(signerAddress))
  return isPayload
    ? encodeTransactionPayload(signable.voucher)
    : encodeTransactionEnvelope(signable.voucher)
}

export const encodeAccountProof = (
  address: string,
  appIdentifier: string,
  nonceHex: string,
  includeDomainTag = true
): string => {
  const rlpHex = bytesToHex(
    encodeRlpBytes([
      appIdentifier,
      addressBytes(arrayifyHex(address)),
      hexToBytes(arrayifyHex(nonceHex)),
    ])
  )
  return includeDomainTag ? ACCOUNT_PROOF_DOMAIN_TAG + rlpHex : rlpHex
}

export const sha3_256 = (hex: string) => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(arrayifyHex(hex), "hex"))
  return (sha.digest() as Buffer).toString("hex")
}
