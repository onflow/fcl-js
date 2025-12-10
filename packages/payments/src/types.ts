import type {createFlowClientCore} from "@onflow/fcl-core"

/**
 * Base intent for funding a Flow account
 */
export interface BaseFundingIntent {
  /** Type discriminator for the funding method */
  kind: string
  /** Destination address in CAIP-10 format: `namespace:chainId:address` (e.g., `"eip155:747:0x..."`) */
  destination: string
  /** Token identifier - EVM address (`"0xa0b8..."`) or Cadence vault identifier (`"A.xxx.Token.Vault"`) */
  currency: string
  /** Amount in human-readable decimal format (e.g., `"1.5"` for 1.5 tokens). Provider converts to appropriate format (base units for EVM, UFix64 for Cadence). */
  amount?: string
}

/**
 * Intent to fund an account using crypto (cross-chain bridge)
 */
export interface CryptoFundingIntent extends BaseFundingIntent {
  kind: "crypto"
  /** Source blockchain in CAIP-2 format: `namespace:chainId` (e.g., `"eip155:1"` for Ethereum mainnet) */
  sourceChain: string
  /** Source token identifier - EVM address on the source chain */
  sourceCurrency: string
}

/**
 * Intent to fund an account using fiat currency (credit card, bank transfer, etc.)
 */
export interface FiatFundingIntent extends BaseFundingIntent {
  kind: "fiat"
  /** Payment method type (e.g., `"card"`, `"bank_transfer"`) - Optional, provider may allow user to choose */
  paymentType?: string
}

/**
 * Union type representing all possible funding intents
 */
export type FundingIntent = CryptoFundingIntent | FiatFundingIntent

/**
 * Base session returned by a funding provider
 */
export interface BaseSession {
  /** Unique session identifier */
  id: string
  /** ID of the provider that created this session */
  providerId: string
  /** Type discriminator for the funding method */
  kind: "crypto" | "fiat"
}

/**
 * Session for crypto funding with deposit address instructions
 */
export interface CryptoFundingSession extends BaseSession {
  kind: "crypto"
  /** Instructions for the user to complete the funding */
  instructions: {
    /** Deposit address where user should send funds */
    address: string
    /** Optional memo/tag for the deposit */
    memo?: string
  }
}

/**
 * Session for fiat funding with payment URL
 */
export interface FiatFundingSession extends BaseSession {
  kind: "fiat"
  /** Instructions for the user to complete the funding */
  instructions: {
    /** URL to the payment page */
    url: string
    /** Optional provider name for display purposes */
    providerName?: string
  }
}

/**
 * Union type representing all possible funding sessions
 */
export type FundingSession = CryptoFundingSession | FiatFundingSession

import type {VM} from "./constants"

/**
 * Base capabilities supported by a funding provider
 */
export interface BaseProviderCapability {
  /** List of supported token identifiers (EVM addresses or Cadence vault IDs) */
  currencies?: string[]
  /** Minimum funding amount in human-readable format */
  minAmount?: string
  /** Maximum funding amount in human-readable format */
  maxAmount?: string
}

/**
 * Capabilities for a crypto funding provider
 */
export interface CryptoProviderCapability extends BaseProviderCapability {
  /** Type discriminator */
  type: "crypto"
  /** List of supported source chains in CAIP-2 format (e.g., `["eip155:1", "eip155:137"]`) */
  sourceChains?: string[]
  /** List of supported source currencies */
  sourceCurrencies?: string[]
}

/**
 * Capabilities for a fiat funding provider
 */
export interface FiatProviderCapability extends BaseProviderCapability {
  /** Type discriminator */
  type: "fiat"
  /** List of supported payment methods (e.g., `["card", "bank_transfer"]`) */
  paymentTypes?: string[]
}

/**
 * Union type representing all provider capability types
 */
export type ProviderCapability =
  | CryptoProviderCapability
  | FiatProviderCapability

/**
 * Interface that all funding providers must implement
 */
export interface FundingProvider {
  /** Unique provider identifier */
  id: string
  /**
   * Get the capabilities supported by this provider
   * @returns Promise resolving to an array of capability objects
   */
  getCapabilities(): Promise<ProviderCapability[]>
  /**
   * Start a new funding session
   * @param intent - The funding intent describing what the user wants to do
   * @returns Promise resolving to a funding session with instructions
   */
  startSession(intent: FundingIntent): Promise<FundingSession>
}

/**
 * Factory function that creates a FundingProvider
 * Used for dependency injection of Flow client from PaymentsClient
 */
export type FundingProviderFactory = (params: {
  flowClient: ReturnType<typeof createFlowClientCore>
}) => FundingProvider
