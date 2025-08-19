import {type FlowNetwork} from "@onflow/react-sdk"

export const ACCESS_NODE_URLS: Record<any, string> = {
  local: "http://localhost:8888",
  emulator: "http://localhost:8888",
  testnet: "https://rest-testnet.onflow.org",
  mainnet: "https://rest-mainnet.onflow.org",
}

export const BLOCK_EXPLORER_URLS: Record<any, string> = {
  local: "https://testnet.flowscan.org",
  emulator: "https://testnet.flowscan.org",
  testnet: "https://testnet.flowscan.org",
  mainnet: "https://flowscan.org",
}

export const CONTRACT_ADDRESSES: Record<string, Record<any, string>> = {
  FlowToken: {
    local: "0x0ae53cb6e3f42a79",
    emulator: "0x0ae53cb6e3f42a79",
    testnet: "0x7e60df042a9c0868",
    mainnet: "0x1654653399040a61",
  },
  ExampleNFT: {
    local: "0xf8d6e0586b0a20c7",
    emulator: "0xf8d6e0586b0a20c7",
    testnet: "0x012e4d204a60ac6f",
    mainnet: "0x1d7e57aa55817448",
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
