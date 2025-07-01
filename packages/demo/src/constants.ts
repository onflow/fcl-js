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

export const CONTRACT_ADDRESSES: Record<string, Record<FlowNetwork, string>> = {
  FlowToken: {
    emulator: "0x0ae53cb6e3f42a79",
    testnet: "0x7e60df042a9c0868",
    mainnet: "0x1654653399040a61",
  },
}

// Helper function to get contract address for current network
export const getContractAddress = (
  contractName: keyof typeof CONTRACT_ADDRESSES,
  network: FlowNetwork
): string => {
  return CONTRACT_ADDRESSES[contractName][network]
}

// Helper function to generate event type for current network
export const getEventType = (
  contractName: keyof typeof CONTRACT_ADDRESSES,
  eventName: string,
  network: FlowNetwork
): string => {
  const address = getContractAddress(contractName, network)
  return `A.${address.replace("0x", "")}.${contractName}.${eventName}`
}
