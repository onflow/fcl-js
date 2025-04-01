export const flowMainnet: Record<string, unknown> = {
  "flow.network": "mainnet",
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
}

export const flowTestnet: Record<string, unknown> = {
  "flow.network": "testnet",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
}

export const flowEmulator: Record<string, unknown> = {
  "flow.network": "local",
  "accessNode.api": "http://127.0.0.1:8888",
  "discovery.wallet": "http://localhost:8701/fcl/authn",
}
