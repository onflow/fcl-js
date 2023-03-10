/**
 * @description Removes 0x from address if present
 * @param {string} address - Flow address
 * @returns {string} - Flow address without 0x prefix
 */
 export function sansPrefix(address) {
  if (address == null) return null
  return address.replace(/^0x/, "").replace(/^Fx/, "")
}

/**
 * @description Adds 0x to address if not already present
 * @param {string} address - Flow address
 * @returns {string} - Flow address with 0x prefix
 */
export function withPrefix(address) {
  if (address == null) return null
  return "0x" + sansPrefix(address)
}

/**
 * @description Adds 0x to address if not already present
 * @param {string} address - Flow address
 * @returns {string} - Flow address with 0x prefix
 */
export function display(address) {
  return withPrefix(address)
}
