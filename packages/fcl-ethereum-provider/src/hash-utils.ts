import { keccak_256 } from "@noble/hashes/sha3"
import { TypedData } from "./types/eth"

/**
 * Hash for legacy `eth_signTypedData`
 */
export function hashTypedDataLegacy(data: TypedData): string {
  return `0x${Buffer.from(keccak_256(Buffer.from(JSON.stringify(data), "utf8"))).toString("hex")}`
}

/**
 * Hash for `eth_signTypedData_v3`
 */
export function hashTypedDataV3(data: TypedData): string {
  const domainHash = keccak_256(Buffer.from(JSON.stringify(data.domain), "utf8"))
  const messageHash = keccak_256(Buffer.from(JSON.stringify(data.message), "utf8"))

  const fullHash = keccak_256(
    Buffer.concat([
      Buffer.from("\x19\x01"), // EIP-712 prefix
      domainHash,
      messageHash,
    ])
  )

  return `0x${Buffer.from(fullHash).toString("hex")}`
}

/**
 * Hash for `eth_signTypedData_v4`
 */
export function hashTypedDataV4(data: TypedData): string {
  return `0x${Buffer.from(keccak_256(Buffer.from(JSON.stringify(data), "utf8"))).toString("hex")}`
}
