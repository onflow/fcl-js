export function sansPrefix(address) {
  if (address == null) return null
  return address
    .replace(/^0x/, "")
    .replace(/^Fx/, "")
}

export function withPrefix(address) {
  if (address == null) return null
  return "0x" + sansPrefix(address)
}

export function display(address) {
  return withPrefix(address)
}
