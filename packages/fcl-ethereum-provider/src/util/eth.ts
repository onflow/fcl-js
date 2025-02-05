export function formatChainId(chainId: string | number): `0x${string}` {
  const numericChainId =
    typeof chainId === "string" ? parseInt(chainId) : chainId
  return `0x${numericChainId.toString(16)}`
}
