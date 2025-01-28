export function validateChainId(chainId: string) {
  if (!chainId.match(/^[0-9]+$/)) {
    throw new Error("Invalid chainId")
  }
}
