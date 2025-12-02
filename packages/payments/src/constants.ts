/**
 * Constants used throughout the payments package
 */

/**
 * Virtual machine types supported by the Flow blockchain
 */
export const VM = {
  EVM: "evm",
  CADENCE: "cadence",
} as const

export type VM = (typeof VM)[keyof typeof VM]

/**
 * Flow network identifiers
 */
export const NETWORK = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  LOCAL: "local",
} as const

export type Network = (typeof NETWORK)[keyof typeof NETWORK]

/**
 * Funding method types
 */
export const FUNDING_KIND = {
  CRYPTO: "crypto",
  FIAT: "fiat",
} as const

export type FundingKind = (typeof FUNDING_KIND)[keyof typeof FUNDING_KIND]

/**
 * CAIP identifier formats
 * @see https://github.com/ChainAgnostic/CAIPs
 */
export const CAIP = {
  /** CAIP-2: Blockchain ID Specification (namespace:chainId) */
  CHAIN_ID_REGEX: /^[a-z]+:\d+$/,
  /** CAIP-10: Account ID Specification (namespace:chainId:address) */
  ACCOUNT_ID_REGEX: /^[a-z]+:\d+:0x[a-fA-F0-9]+$/,
  /** EIP-155 namespace for Ethereum-compatible chains */
  EIP155_NAMESPACE: "eip155",
} as const

/**
 * Flow chain IDs (numeric, as returned by flowClient.getChainId())
 */
export const FLOW_CHAIN_ID = {
  MAINNET: "747",
  TESTNET: "545",
  LOCAL: "646",
} as const

/**
 * Address format patterns
 */
export const ADDRESS_PATTERN = {
  /** EVM address format: 0x followed by 40 hex characters */
  EVM: /^0x[a-fA-F0-9]{40}$/,
  /** Cadence address format: 0x followed by 16 hex characters */
  CADENCE: /^0x[a-fA-F0-9]{16}$/,
  /** Cadence vault identifier format: A.{address}.{contract}.Vault */
  CADENCE_VAULT: /^A\.[a-fA-F0-9]+\.[A-Za-z0-9_]+\.Vault$/,
} as const
