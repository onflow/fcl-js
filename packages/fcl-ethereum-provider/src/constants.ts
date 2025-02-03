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

export enum ContractType {
  EVM = "EVM",
}

export enum EventType {
  TRANSACTION_EXECUTED = "TRANSACTION_EXECUTED",
}

export const EVENT_IDENTIFIERS = {
  [EventType.TRANSACTION_EXECUTED]: {
    [FlowNetwork.TESTNET]: "A.8c5303eaa26202d6.EVM.TransactionExecuted",
    [FlowNetwork.MAINNET]: "A.e467b9dd11fa00df.EVM.TransactionExecuted",
  },
}

export const FLOW_CONTRACTS = {
  [ContractType.EVM]: {
    [FlowNetwork.TESTNET]: "0x8c5303eaa26202d6",
    [FlowNetwork.MAINNET]: "0xe467b9dd11fa00df",
  },
}

export interface TransactionExecutedEvent {
  hash: string[]
  index: string
  type: string
  payload: string[]
  errorCode: string
  errorMessage: string
  gasConsumed: string
  contractAddress: string
  logs: string[]
  blockHeight: string
  returnedData: string[]
  precompiledCalls: string[]
  stateUpdateChecksum: string
}

export const ACCESS_NODE_API_KEY = "accessNode.api"
