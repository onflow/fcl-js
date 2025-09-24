/**
 * Utility functions for working with Flow Chain IDs
 *
 * FCL's getChainId() returns simple network identifiers:
 * - "mainnet" for Flow Mainnet
 * - "testnet" for Flow Testnet
 * - "emulator" or "local" for Flow Emulator/Local development
 *
 * This differs from getNetworkParameters() which returns prefixed formats
 * like "flow-mainnet", "flow-testnet", etc.
 */

export type FlowChainId = "mainnet" | "testnet" | "emulator" | "local"
export type FlowNetworkParametersChainId =
  | "flow-mainnet"
  | "flow-testnet"
  | "flow-emulator"
  | "flow-canarynet"
export type FlowEVMChainId = 747 | 545

/**
 * Normalize chain ID to a consistent format
 */
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

/**
 * Get human-readable network name
 */
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

/**
 * Get corresponding EVM Chain ID for Flow networks
 */
export function getEVMChainId(chainId: string): FlowEVMChainId | null {
  const normalized = normalizeChainId(chainId)
  switch (normalized) {
    case "mainnet":
      return 747
    case "testnet":
      return 545
    case "emulator":
      return null // Emulator doesn't have a fixed EVM chain ID
    default:
      return null
  }
}

/**
 * Check if chain ID represents a production network
 */
export function isProductionNetwork(chainId: string): boolean {
  return normalizeChainId(chainId) === "mainnet"
}

/**
 * Check if chain ID represents a development/test network
 */
export function isDevelopmentNetwork(chainId: string): boolean {
  const normalized = normalizeChainId(chainId)
  return normalized === "testnet" || normalized === "emulator"
}
