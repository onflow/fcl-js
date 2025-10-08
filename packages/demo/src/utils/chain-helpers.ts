export type FlowChainId = "mainnet" | "testnet" | "emulator" | "local"
export type FlowNetworkParametersChainId =
  | "flow-mainnet"
  | "flow-testnet"
  | "flow-emulator"
  | "flow-canarynet"
export type FlowEVMChainId = 747 | 545

export function normalizeChainId(chainId: string): FlowChainId | "unknown" {
  switch (chainId.toLowerCase()) {
    case "mainnet":
    case "flow-mainnet":
      return "mainnet"
    case "testnet":
    case "flow-testnet":
      return "testnet"
    case "emulator":
    case "local":
    case "flow-emulator":
      return "emulator"
    default:
      return "unknown"
  }
}

export function getNetworkName(chainId: string): string {
  const normalized = normalizeChainId(chainId)
  switch (normalized) {
    case "mainnet":
      return "Flow Mainnet"
    case "testnet":
      return "Flow Testnet"
    case "emulator":
      return "Flow Emulator"
    default:
      return "Unknown Network"
  }
}

export function getEVMChainId(chainId: string): FlowEVMChainId | null {
  const normalized = normalizeChainId(chainId)
  switch (normalized) {
    case "mainnet":
      return 747
    case "testnet":
      return 545
    case "emulator":
      return null
    default:
      return null
  }
}

export function isProductionNetwork(chainId: string): boolean {
  return normalizeChainId(chainId) === "mainnet"
}

export function isDevelopmentNetwork(chainId: string): boolean {
  const normalized = normalizeChainId(chainId)
  return normalized === "testnet" || normalized === "emulator"
}
