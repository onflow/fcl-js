var HEX = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
var T = HEX.length

/**
 * Generates a unique 32 character alphanumeric string
 */
export function uid(): string {
  var str = "",
    num = 32
  while (num--) str += HEX[(Math.random() * T) | 0]
  return str
}
