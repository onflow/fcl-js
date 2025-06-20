import {type FlowNetwork} from "@onflow/kit"

export const ACCESS_NODE_URLS: Record<FlowNetwork, string> = {
  emulator: "http://localhost:8888",
  testnet: "https://rest-testnet.onflow.org",
  mainnet: "https://rest-mainnet.onflow.org",
}

export const BLOCK_EXPLORER_URLS: Record<FlowNetwork, string> = {
  emulator: "https://testnet.flowscan.org",
  testnet: "https://testnet.flowscan.org",
  mainnet: "https://flowscan.org",
}
