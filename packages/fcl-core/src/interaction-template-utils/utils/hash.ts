import {SHA3} from "sha3"
import {Buffer} from "@onflow/rlp"

/**
 * @description Generates a SHA3-256 hash of a UTF-8 string. This function is commonly used in Flow
 * for creating deterministic hashes of Cadence code, interaction templates, and other string data
 * that need to be uniquely identified or verified for integrity.
 *
 * @param utf8String The UTF-8 string to hash
 * @returns The SHA3-256 hash of the input string as a hexadecimal string
 *
 * @example
 * // Generate hash of Cadence code
 * const cadenceCode = "access(all) fun main(): String { return \"Hello\" }"
 * const hash = genHash(cadenceCode)
 * console.log(hash) // "a1b2c3d4e5f6..." (64-character hex string)
 */
export function genHash(utf8String: string): string {
  const sha = new SHA3(256)
  sha.update(Buffer.from(utf8String, "utf8"))
  return sha.digest("hex")
}
