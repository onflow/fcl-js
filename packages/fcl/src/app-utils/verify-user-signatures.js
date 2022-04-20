import {invariant} from "@onflow/util-invariant"
import {query} from "../exec/query"
import {config} from "@onflow/config"

export const validateArgs = (msg, compSigs) => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Signed message must be a hex string")
  invariant(
    Array.isArray(compSigs) &&
      compSigs.every((sig, i, arr) => sig.f_type === "CompositeSignature"),
    "Must include an Array of CompositeSignatures to verify"
  )
  invariant(
    compSigs.map(cs => cs.addr).every((addr, i, arr) => addr === arr[0]),
    "User signatures to be verified must be from a single account address"
  )
  return true
}

/**
 * Verify a valid signature/s for an account on Flow.
 *
 * @param {string} msg - A message string in hexadecimal format
 * @param {Array} compSigs - An array of Composite Signatures
 * @param {string} compSigs[].addr - The account address
 * @param {number} compSigs[].keyId - The account keyId
 * @param {string} compSigs[].signature - The signature to verify
 * @return {bool}
 *
 * @example
 *
 *  const isValid = await fcl.AppUtils.verifyUserSignatures(
 *    Buffer.from('FOO').toString("hex"),
 *    [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}]
 *  )
 */
export async function verifyUserSignatures(message, compSigs) {
  validateArgs(message, compSigs)

  const address = compSigs[0].addr
  let signaturesArr = []
  let keyIndices = []

  for (const el of compSigs) {
    signaturesArr.push(el.signature)
    keyIndices.push(el.keyId)
  }

  const getVerifyUserSignaturesScript = async () => {
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
        return FCLCrypto.verifyUserSignatures(address: address, message: message, keyIndices: keyIndices, signatures: signatures)
      }
    `
  }

  return query({
    cadence: await getVerifyUserSignaturesScript(),
    args: (arg, t) => [
      arg(address, t.Address),
      arg(message, t.String),
      arg(keyIndices, t.Array([t.Int])),
      arg(signaturesArr, t.Array([t.String])),
    ],
  })
}
