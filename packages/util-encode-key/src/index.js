import {invariant} from "@onflow/util-invariant"
import {encode} from "@onflow/rlp"

// Curves
export const ECDSA_P256 = 2
export const ECDSA_secp256k1 = 3
const VALID_CURVES = new Set([ECDSA_P256, ECDSA_secp256k1])

// Hashing
export const SHA2_256 = 1
export const SHA3_256 = 3
const VALID_HASHINGS = new Set([SHA2_256, SHA3_256])

export function encodeKey(key, curve, hash, weight = 1000) {
  invariant(
    typeof key === "string",
    "encodeKey(key, curve, hash, weight) -- invalid key (expecting type of string)"
  )
  invariant(
    /^[0-9a-z]+$/.test(key),
    "encodeKey(key, curve, hash, weight) -- invalid key (incorrect format)"
  )
  invariant(
    typeof curve === "number",
    "encodeKey(key, curve, hash, weight) -- invalid curve (expecting type of number)"
  )
  invariant(
    VALID_CURVES.has(curve),
    "encodeKey(key, curve, hash, weight) -- invalid curve (value not included in set of valid curves)"
  )
  invariant(
    typeof hash === "number",
    "encodeKey(key, curve, hash, weight) -- invalid hash (expecting typeof number)"
  )
  invariant(
    VALID_HASHINGS.has(hash),
    "encodeKey(key, curve, hash, weight) -- invalid hash (value not included in set of valid hashings)"
  )
  invariant(
    weight >= 0 && weight <= 1000,
    "encodeKey(key, curve, hash, weight) -- weight needs to be between (inclusive of) 0 and 1000"
  )

  return encode([Buffer.from(key, "hex"), curve, hash, weight]).toString("hex")
}
