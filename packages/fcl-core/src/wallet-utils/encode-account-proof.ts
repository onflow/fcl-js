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

/**
 * @description Encodes account proof data for cryptographic signing on the Flow blockchain. This function
 * creates a standardized message format that combines the application identifier, account address,
 * and nonce into a format suitable for cryptographic signing. The encoded message can then be signed
 * by the account's private key to create an account proof.
 *
 * @param data Object containing the account proof components
 * @param data.address The Flow account address for which to create the proof
 * @param data.nonce A random hexadecimal string (minimum 32 bytes/64 hex chars) to prevent replay attacks
 * @param data.appIdentifier A unique identifier for your application to prevent cross-app replay attacks
 * @param includeDomainTag Whether to include the FCL domain tag in the encoding
 *
 * @returns The encoded message as a hexadecimal string ready for signing
 *
 * @throws If required parameters are missing or invalid, or if nonce is too short
 *
 * @example
 * // Basic account proof encoding
 * import { encodeAccountProof } from "@onflow/fcl"
 *
 * const accountProofData = {
 *   address: "0x1234567890abcdef",
 *   nonce: "75f8587e5bd982ec9289c5be1f9426bd12b4c1de9c7a7e4d8c5f9e8b2a7c3f1e9", // 64 hex chars (32 bytes)
 *   appIdentifier: "MyAwesomeApp"
 * }
 *
 * const encodedMessage = encodeAccountProof(accountProofData)
 * console.log("Encoded message:", encodedMessage)
 */
export const encodeAccountProof = (
  {address, nonce, appIdentifier}: AccountProofData,
  includeDomainTag: boolean = true
): string => {
  invariant(
    !!address,
    "Encode Message For Provable Authn Error: address must be defined"
  )
  invariant(
    !!nonce,
    "Encode Message For Provable Authn Error: nonce must be defined"
  )
  invariant(
    !!appIdentifier,
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
