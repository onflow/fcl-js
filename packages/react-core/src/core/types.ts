/**
 * Flow network identifier
 *
 * Standard networks: "emulator", "testnet", "mainnet"
 * Custom networks: Any string (e.g., "mainnet-fork", "testnet-fork")
 */
export type FlowNetwork = "emulator" | "testnet" | "mainnet" | (string & {})
