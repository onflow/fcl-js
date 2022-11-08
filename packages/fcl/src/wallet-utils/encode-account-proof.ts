import {sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {Buffer, encode as rlpEncode} from "@onflow/rlp"

const rightPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padEnd(pad * 2, "0"), "hex")

const leftPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padStart(pad * 2, "0"), "hex")

const addressBuffer = addr => leftPaddedHexBuffer(addr, 8)

const nonceBuffer = nonce => Buffer.from(nonce, "hex")

export const encodeAccountProof = (
  {address, nonce, appIdentifier},
  includeDomainTag = true
) => {
  invariant(
    address,
    "Encode Message For Provable Authn Error: address must be defined"
  )
  invariant(
    nonce,
    "Encode Message For Provable Authn Error: nonce must be defined"
  )
  invariant(
    appIdentifier,
    "Encode Message For Provable Authn Error: appIdentifier must be defined"
  )

  invariant(
    nonce.length >= 64,
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
        addressBuffer(sansPrefix(address)),
        nonceBuffer(nonce),
      ]),
    ]).toString("hex")
  }

  return rlpEncode([
    appIdentifier,
    addressBuffer(sansPrefix(address)),
    nonceBuffer(nonce),
  ]).toString("hex")
}
