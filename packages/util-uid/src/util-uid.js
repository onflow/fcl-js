/**
 * Generates a unique identifier
 * @returns {string}
 */
var HEX = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
var T = HEX.length

export function uid() {
  var str = "",
    num = 32
  while (num--) str += HEX[(Math.random() * T) | 0]
  return str
}
