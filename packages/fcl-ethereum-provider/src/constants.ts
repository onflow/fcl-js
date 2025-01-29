export enum FlowNetwork {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export const FLOW_CHAINS = {
  [FlowNetwork.MAINNET]: {
    eip155ChainId: 747,
    publicRpcUrl: "https://access.mainnet.nodes.onflow.org",
  },
  [FlowNetwork.TESTNET]: {
    eip155ChainId: 646,
    publicRpcUrl: "https://access.testnet.nodes.onflow.org",
  },
}
