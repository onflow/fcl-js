const HEX = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const T = HEX.length

/**
 * Generates a random unique identifier
 * @returns 32 character alphanumeric string
 */
export function uid(): string {
  let str = "",
    num = 32
  while (num--) str += HEX[(Math.random() * T) | 0]
  return str
}
