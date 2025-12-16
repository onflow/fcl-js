/**
 * CAIP (Chain Agnostic Improvement Proposals) utilities
 * https://github.com/ChainAgnostic/CAIPs
 */

/**
 * Parse a CAIP-2 chain identifier
 * Format: "namespace:chainId" (e.g., "eip155:1" for Ethereum mainnet)
 *
 * @param caip2 - CAIP-2 formatted chain identifier
 * @returns The chain ID portion
 * @throws {Error} If the format is invalid
 *
 * @example
 * ```typescript
 * parseCAIP2("eip155:1") // "1"
 * parseCAIP2("eip155:8453") // "8453"
 * ```
 */
export function parseCAIP2(caip2: string): {
  namespace: string
  chainId: string
} {
  const parts = caip2.split(":")
  if (parts.length !== 2) {
    throw new Error(`Invalid CAIP-2 format: ${caip2}`)
  }
  return {
    namespace: parts[0],
    chainId: parts[1],
  }
}

/**
 * Parse a CAIP-10 account identifier
 * Format: "namespace:chainId:address" (e.g., "eip155:747:0x...")
 *
 * @param caip10 - CAIP-10 formatted account identifier
 * @returns Parsed namespace, chainId, and address
 * @throws {Error} If the format is invalid
 *
 * @example
 * ```typescript
 * parseCAIP10("eip155:747:0xABC123")
 * // { namespace: "eip155", chainId: "747", address: "0xABC123" }
 * ```
 */
export function parseCAIP10(caip10: string): {
  namespace: string
  chainId: string
  address: string
} {
  const parts = caip10.split(":")
  if (parts.length !== 3) {
    throw new Error(`Invalid CAIP-10 format: ${caip10}`)
  }

  return {
    namespace: parts[0],
    chainId: parts[1],
    address: parts[2],
  }
}
