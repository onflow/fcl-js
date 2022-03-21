import {config} from "@onflow/sdk"
import {invariant} from "@onflow/util-invariant"
import {query} from "../exec/query"
import {encodeAccountProof} from "../wallet-utils"

export const validateArgs = (appIdentifier, address, nonce, signatures) => {
  invariant(typeof appIdentifier === "string", "appIdentifier must be a string")
  invariant(/^[0-9a-f]+$/i.test(nonce), "Nonce must be a hex string")
  invariant(
    Array.isArray(signatures) &&
      signatures.every((sig, i, arr) => sig.f_type === "CompositeSignature"),
    "Must include an Array of CompositeSignatures to verify"
  )
  invariant(
    signatures.map(cs => cs.addr).every((addr, i, arr) => addr === arr[0]),
    "User signatures to be verified must be from a single account address"
  )
  return true
}

/**
 * Verify a valid account proof signature or signatures for an account on Flow.
 *
 * @param {string} appIdentifier - A message string in hexadecimal format
 * @param {Object} accountProofData - An object consisting of address, nonce, and signatures
 * @param {string} accountProofData.address - A Flow account address
 * @param {string} accountProofData.nonce - A random string in hexadecimal format (minimum 32 bytes in total, i.e 64 hex characters)
 * @param {Object[]} accountProofData.signatures - An array of composite signatures to verify
 * @return {bool}
 *
 * @example
 *
 *  const accountProofData = {
 *   address: "0x123",
 *   nonce: "F0123"
 *   signatures: [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}],
 *  }
 *
 *  const isValid = await fcl.verifyAccountProof(
 *    "AwesomeAppId",
 *    accountProofData,
 *  )
 */

export async function verifyAccountProof(
  appIdentifier,
  {address, nonce, signatures}
) {
  validateArgs(appIdentifier, address, nonce, signatures)

  const message = encodeAccountProof({address, nonce, appIdentifier}, false)

  let signaturesArr = []
  let keyIndices = []

  for (const el of signatures) {
    signaturesArr.push(el.signature)
    keyIndices.push(el.keyId)
  }

  const getVerifyAccountProofSignaturesScript = async () => {
    const contractAddress =
      (await config.get("env")) === "testnet"
        ? "0x74daa6f9c7ef24b1"
        : "0xb4b82a1c9d21d284"

    return `
      import FCLCrypto from ${contractAddress}

      pub fun main(
          address: Address, 
          message: String, 
          keyIndices: [Int], 
          signatures: [String]
      ): Bool {
        return FCLCrypto.verifyAccountProofSignatures(address: address, message: message, keyIndices: keyIndices, signatures: signatures)
      }
    `
  }

  return await query({
    cadence: await getVerifyAccountProofSignaturesScript(),
    args: (arg, t) => [
      arg(address, t.Address),
      arg(message, t.String),
      arg(keyIndices, t.Array([t.Int])),
      arg(signaturesArr, t.Array([t.String])),
    ],
  })
}
