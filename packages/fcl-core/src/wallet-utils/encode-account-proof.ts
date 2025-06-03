import {sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {Buffer, encode as rlpEncode} from "@onflow/rlp"

export interface AccountProofData {
  address?: string
  nonce?: string
  appIdentifier?: string
}

const rightPaddedHexBuffer = (value: string, pad: number): Buffer =>
  Buffer.from(value.padEnd(pad * 2, "0"), "hex")

const leftPaddedHexBuffer = (value: string, pad: number): Buffer =>
  Buffer.from(value.padStart(pad * 2, "0"), "hex")

const addressBuffer = (addr: string): Buffer => leftPaddedHexBuffer(addr, 8)

const nonceBuffer = (nonce: string): Buffer => Buffer.from(nonce, "hex")

export const encodeAccountProof = (
  {address, nonce, appIdentifier}: AccountProofData,
  includeDomainTag: boolean = true
): string => {
  invariant(
    address as any,
    "Encode Message For Provable Authn Error: address must be defined"
  )
  invariant(
    nonce as any,
    "Encode Message For Provable Authn Error: nonce must be defined"
  )
  invariant(
    appIdentifier as any,
    "Encode Message For Provable Authn Error: appIdentifier must be defined"
  )

  invariant(
    nonce!.length >= 64,
    "Encode Message For Provable Authn Error: nonce must be minimum of 32 bytes"
  )

  const ACCOUNT_PROOF_DOMAIN_TAG = rightPaddedHexBuffer(
    Buffer.from("FCL-ACCOUNT-PROOF-V0.0").toString("hex"),
    32
  )

  if (includeDomainTag) {
    return Buffer.concat([
      ACCOUNT_PROOF_DOMAIN_TAG,
      rlpEncode([
        appIdentifier,
        addressBuffer(sansPrefix(address!)),
        nonceBuffer(nonce!),
      ]),
    ]).toString("hex")
  }

  return rlpEncode([
    appIdentifier,
    addressBuffer(sansPrefix(address!)),
    nonceBuffer(nonce!),
  ]).toString("hex")
}
