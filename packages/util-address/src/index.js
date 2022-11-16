/**
 * Removes 0x from address if present
 * @param {string} address
 * @returns {string}
 */
export function sansPrefix(address) {
  if (address == null) return null
  return address.replace(/^0x/, "").replace(/^Fx/, "")
}

/**
 * Adds 0x to address if not already present
 * @param {string} address
 * @returns {string}
 */
export function withPrefix(address) {
  if (address == null) return null
  return "0x" + sansPrefix(address)
}

/**
 * Adds 0x to address if not already present
 * @param {string} address
 * @returns {string}
 */
export function display(address) {
  return withPrefix(address)
}
