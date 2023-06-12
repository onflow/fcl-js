const NOT_IMPLEMENTED = () => {
  throw new Error("Strategy util has not been implemented on this platform")
}

export const STRATEGY_UTIL_REGISTRY = {
  "FRAME": NOT_IMPLEMENTED,
  "POP": NOT_IMPLEMENTED,
  "TAB": NOT_IMPLEMENTED,
}