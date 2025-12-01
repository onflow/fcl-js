// FlowNetwork type - represents the Flow network environments
export type FlowNetwork = "mainnet" | "testnet" | "emulator"
type ExplorerNetwork = Extract<FlowNetwork, "mainnet" | "testnet">

export const BLOCK_EXPLORER_URL: Record<ExplorerNetwork, string> = {
  mainnet: "https://www.flowscan.io",
  testnet: "https://testnet.flowscan.io",
}

export const getFlowscanTxUrl = (
  txId: string,
  chainId?: FlowNetwork | string | null
): string | null => {
  // Check for emulator or local (both strings identify emulator)
  if (!chainId || chainId === "emulator" || chainId === "local") return null
  return `${BLOCK_EXPLORER_URL[chainId as ExplorerNetwork]}/tx/${txId}`
}

export const getFlowscanAccountUrl = (
  address: string,
  chainId?: FlowNetwork | string | null
): string | null => {
  // Check for emulator or local (both strings identify emulator)
  if (!address || !chainId || chainId === "emulator" || chainId === "local") {
    return null
  }
  return `${BLOCK_EXPLORER_URL[chainId as ExplorerNetwork]}/account/${address}`
}

export const getFlowscanScheduledTxUrl = (
  txId: string,
  chainId?: FlowNetwork | string | null
): string | null => {
  // Check for emulator or local (both strings identify emulator)
  if (!chainId || chainId === "emulator" || chainId === "local") return null
  return `${BLOCK_EXPLORER_URL[chainId as ExplorerNetwork]}/scheduled/${txId}`
}
