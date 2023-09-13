
export function sansPrefix(address: null): null;
export function sansPrefix(address: string): string;
/**
 * @description Removes 0x from address if present
 * @param address - Flow address
 * @returns Flow address without 0x prefix
 */
export function sansPrefix(address: string | null): string | null {
  if (address == null) return null
  return address.replace(/^0x/, "").replace(/^Fx/, "")
}

/**
 * @description Adds 0x to address if not already present
 * @param address - Flow address
 * @returns Flow address with 0x prefix
 */
export function withPrefix(address: string | null): string | null {
  if (address == null) return null
  return `0x` + sansPrefix(address)
}

/**
 * @description Adds 0x to address if not already present
 * @param address - Flow address
 * @returns Flow address with 0x prefix
 */
export function display(address: string | null): string | null {
  return withPrefix(address)
}
