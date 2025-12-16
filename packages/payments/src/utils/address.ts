import {ADDRESS_PATTERN} from "../constants"

/**
 * Check if a string is a valid EVM address
 * Format: 0x followed by 40 hexadecimal characters
 *
 * @param value - String to validate
 * @returns True if the value is a valid EVM address
 *
 * @example
 * ```typescript
 * isEvmAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913") // true
 * isEvmAddress("0x1234") // false
 * ```
 */
export function isEvmAddress(value: string): boolean {
  return ADDRESS_PATTERN.EVM.test(value)
}

/**
 * Check if a string is a valid Cadence address
 * Format: 0x followed by 16 hexadecimal characters
 *
 * @param value - String to validate
 * @returns True if the value is a valid Cadence address
 *
 * @example
 * ```typescript
 * isCadenceAddress("0x1654653399040a61") // true
 * isCadenceAddress("0x1234") // false
 * ```
 */
export function isCadenceAddress(value: string): boolean {
  return ADDRESS_PATTERN.CADENCE.test(value)
}
