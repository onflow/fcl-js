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

/**
 * Encodes a key into a hex string
 * @param key - The key to encode (DER Hex)
 * @param curve - The curve Flow needs to use with your key [ECDSA_P256|ECDSA_secp256k1]
 * @param hash - The hashing algorythm Flow needs to use with your key [SHA2_256|SHA3_256]
 * @param weight - The weight you want this key to have [Range: 0..1000]
 * @returns The encoded key
 * @throws {Error} - Throws if the key is not a string
 * @throws {Error} - Throws if the key is not in the correct format
 * @throws {Error} - Throws if the curve is not a number
 * @throws {Error} - Throws if the curve is not a valid curve
 * @throws {Error} - Throws if the hash is not a number
 * @throws {Error} - Throws if the hash is not a valid hashing algorithm
 * @throws {Error} - Throws if the weight is not between 0 and 1000
 * @example
 * import {encodeKey, ECDSA_P256, SHA3_256} from "@onflow/util-encode-key"
 * encodeKey("aabbccdd", ECDSA_P256, SHA3_256, 1000) // => "aabbccdd0201000"
 */
export function encodeKey(
  key: string,
  curve: number,
  hash: number,
  weight = 1000
): string {
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
