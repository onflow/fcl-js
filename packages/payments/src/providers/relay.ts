import type {
  FundingProvider,
  FundingIntent,
  FundingSession,
  CryptoFundingIntent,
  CryptoFundingSession,
  ProviderCapability,
} from "../types"
import {ADDRESS_PATTERN, FLOW} from "../constants"

/**
 * Configuration for the Relay funding provider
 */
export interface RelayConfig {
  /** Optional custom Relay API URL (defaults to `https://api.relay.link`) */
  apiUrl?: string
}

// Constants
const DEFAULT_RELAY_API_URL = "https://api.relay.link"
const DEPOSIT_ADDRESS_TRADE_TYPE = "EXACT_INPUT" as const

// CAIP-2 parser: "eip155:1" → "1"
function parseCAIP2ChainId(caip2: string): string {
  const parts = caip2.split(":")
  if (parts.length !== 2) {
    throw new Error(`Invalid CAIP-2 format: ${caip2}`)
  }
  return parts[1]
}

// CAIP-10 parser: "eip155:747:0x..." → { namespace, chainId, address }
function parseCAIP10(caip10: string): {
  namespace: string
  chainId: string
  address: string
} {
  const parts = caip10.split(":")
  if (parts.length !== 3) {
    throw new Error(`Invalid CAIP-10 format: ${caip10}`)
  }

  return {
    namespace: parts[0],
    chainId: parts[1],
    address: parts[2],
  }
}

// Map chain namespace/id to Relay chain ID
function toRelayChainId(namespace: string, chainId: string): string {
  // For EVM chains, Relay uses numeric chain IDs
  return chainId
}

// Helper to detect if a string is an EVM address (0x + 40 hex chars)
function isEvmAddress(value: string): boolean {
  return ADDRESS_PATTERN.EVM.test(value)
}

// Helper to detect if a string is a Cadence address (0x + 16 hex chars)
function isCadenceAddress(value: string): boolean {
  return ADDRESS_PATTERN.CADENCE.test(value)
}

// Helper to detect if a string is a Cadence vault identifier (A.address.Contract.Vault format)
// Resolve currency to address and decimals (supports symbols and EVM addresses)
// Note: Cadence vault identifiers are converted to EVM addresses by the client layer
async function resolveCurrency(
  apiUrl: string,
  chainId: string,
  currency: string
): Promise<{address: string; decimals: number}> {
  // Reject Cadence addresses (not supported by Relay)
  if (isCadenceAddress(currency)) {
    throw new Error(
      `Cadence address format detected for currency "${currency}". ` +
        `Relay requires EVM token addresses (0x + 40 hex chars).`
    )
  }

  // Fetch currency metadata from Relay API
  const currencies = await getRelayCurrencies(apiUrl, chainId)

  // If it's an EVM address, find it in the currency list
  if (isEvmAddress(currency)) {
    const match = currencies.find(
      c => c.address.toLowerCase() === currency.toLowerCase()
    )
    if (!match) {
      throw new Error(
        `Token address "${currency}" not found on chain ${chainId}. ` +
          `Make sure it's supported by Relay.`
      )
    }
    return {address: match.address, decimals: match.decimals}
  }

  // It's a symbol - find by symbol
  const match = currencies.find(
    c => c.symbol.toUpperCase() === currency.toUpperCase()
  )

  if (!match) {
    throw new Error(
      `Token "${currency}" not found on chain ${chainId}. ` +
        `Supported tokens: ${currencies
          .map(c => c.symbol)
          .slice(0, 10)
          .join(", ")}...`
    )
  }

  return {address: match.address, decimals: match.decimals}
}

// Convert human-readable amount to base units
function toBaseUnits(amount: string, decimals: number): string {
  // Remove any whitespace
  const trimmed = amount.trim()

  // Split into integer and decimal parts
  const parts = trimmed.split(".")
  const integerPart = parts[0] || "0"
  const decimalPart = parts[1] || ""

  // Pad or truncate decimal part to match token decimals
  const paddedDecimal = decimalPart.padEnd(decimals, "0").slice(0, decimals)

  // Combine and remove leading zeros
  const combined = integerPart + paddedDecimal
  return BigInt(combined).toString()
}

// Relay API types
interface RelayQuoteRequest {
  user: string
  originChainId: string | number
  destinationChainId: string | number
  originCurrency: string
  destinationCurrency: string
  recipient: string
  amount?: string
  tradeType?: "EXACT_INPUT" | "EXACT_OUTPUT"
  useDepositAddress?: boolean // Enable deposit address mode
  refundTo?: string // Required when useDepositAddress is true
  usePermit?: boolean
  useExternalLiquidity?: boolean
  referrer?: string
}

interface RelayQuoteResponse {
  steps: Array<{
    id: string
    action: string
    description: string
    kind: string
    depositAddress?: string // Present when useDepositAddress is true
    requestId?: string
    items?: Array<{
      status: string
      data?: {
        to?: string
        data?: string
        value?: string
      }
    }>
  }>
  fees?: {
    gas?: {
      amount: string
      amountFormatted: string
      currency: {
        symbol: string
      }
    }
    relayer?: {
      amount: string
      amountFormatted: string
      currency: {
        symbol: string
      }
    }
  }
}

async function callRelayQuote(
  apiUrl: string,
  request: RelayQuoteRequest
): Promise<RelayQuoteResponse> {
  const response = await fetch(`${apiUrl}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Relay API error (${response.status}): ${errorText}`)
  }

  return await response.json()
}

// Relay chains API types
interface RelayChain {
  id: number
  name: string
  displayName?: string
  depositEnabled?: boolean
  disabled?: boolean
  erc20Currencies?: Array<{
    symbol: string
    address: string
    decimals: number
    supportsBridging?: boolean
  }>
  featuredTokens?: Array<{
    symbol: string
    address: string
    decimals: number
  }>
}

// Relay currencies API types
interface RelayCurrency {
  address: string
  symbol: string
  name: string
  decimals: number
  chainId: number | string
  metadata?: {
    verified?: boolean
    isNative?: boolean
    logoURI?: string
  }
}

async function getRelayChains(apiUrl: string): Promise<RelayChain[]> {
  const response = await fetch(`${apiUrl}/chains`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Relay chains: ${response.status}`)
  }

  const data = await response.json()
  return data.chains || []
}

async function getRelayCurrencies(
  apiUrl: string,
  chainId: number | string
): Promise<RelayCurrency[]> {
  const response = await fetch(`${apiUrl}/currencies?chainId=${chainId}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Relay currencies for chain ${chainId}: ${response.status}`
    )
  }

  const data = await response.json()
  // Response might be array or object with currencies property
  return Array.isArray(data) ? data : data.currencies || data.data || []
}

function extractDepositAddress(quote: RelayQuoteResponse): string {
  // Look for a step with depositAddress field
  for (const step of quote.steps) {
    if (step.depositAddress) {
      return step.depositAddress
    }
  }

  throw new Error(
    `No deposit address found in Relay quote response. Ensure useDepositAddress is set to true.`
  )
}

/**
 * Create a Relay funding provider
 *
 * Relay is a cross-chain bridging protocol that enables crypto funding
 * via deposit addresses. Users send funds on one chain, and Relay automatically
 * bridges them to the destination chain.
 *
 * @param config - Optional configuration for the Relay provider
 * @returns A funding provider instance
 *
 * @example
 * ```typescript
 * import {relayProvider} from "@onflow/payments/providers"
 *
 * // Basic usage (custom API URL optional)
 * const provider = relayProvider()
 * const provider = relayProvider({ apiUrl: "https://custom-relay.api" })
 * ```
 */
export function relayProvider(config: RelayConfig = {}): FundingProvider {
  const apiUrl = config.apiUrl || DEFAULT_RELAY_API_URL

  return {
    id: "relay",

    async getCapabilities(): Promise<ProviderCapability[]> {
      try {
        // Fetch supported chains from Relay
        const chains = await getRelayChains(apiUrl)

        // Filter enabled chains with deposit support
        const supportedChains = chains
          .filter(
            chain =>
              !chain.disabled &&
              chain.depositEnabled &&
              chain.erc20Currencies &&
              chain.erc20Currencies.length > 0
          )
          .map(chain => `eip155:${chain.id}`)

        // Collect all unique currency symbols from all chains
        const allCurrencies = new Set<string>()
        chains.forEach(chain => {
          // Add native currency symbols
          if (chain.erc20Currencies) {
            chain.erc20Currencies.forEach(currency => {
              if (currency.supportsBridging) {
                allCurrencies.add(currency.symbol)
              }
            })
          }
          // Also check featured tokens
          if (chain.featuredTokens) {
            chain.featuredTokens.forEach(token => {
              allCurrencies.add(token.symbol)
            })
          }
        })

        return [
          {
            type: "crypto",
            sourceChains: supportedChains,
            sourceCurrencies: Array.from(allCurrencies),
            currencies: Array.from(allCurrencies),
          },
        ]
      } catch (error) {
        throw new Error(
          `Failed to fetch Relay capabilities: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }
    },

    async startSession(intent: FundingIntent): Promise<FundingSession> {
      if (intent.kind === "fiat") {
        throw new Error("Fiat not supported by relay provider")
      }

      const cryptoIntent = intent as CryptoFundingIntent

      // Parse source chain
      const originChainId = parseCAIP2ChainId(cryptoIntent.sourceChain)

      // Parse destination
      const destination = parseCAIP10(cryptoIntent.destination)
      const destinationChainId = toRelayChainId(
        destination.namespace,
        destination.chainId
      )

      // Detect if destination is Cadence (needs bridging after EVM funding)
      const isCadenceDestination = isCadenceAddress(destination.address)
      let actualDestination = destination.address

      // TODO: For Cadence destinations, we need to:
      // 1. Determine the user's COA (Cadence Owned Account) EVM address
      // 2. Fund the COA instead
      // 3. Return instructions for the user to bridge COA → Cadence
      // For now, we reject Cadence destinations until this is implemented
      if (isCadenceDestination) {
        throw new Error(
          `Cadence destination detected: ${destination.address}. ` +
            `Automatic Cadence routing is not yet implemented. ` +
            `Please provide the COA (Cadence Owned Account) EVM address instead. ` +
            `Future versions will automatically route funds through the COA and provide bridging instructions.`
        )
      }

      if (!isEvmAddress(actualDestination)) {
        throw new Error(
          `Invalid EVM address format: ${actualDestination}. ` +
            `Expected 0x followed by 40 hexadecimal characters.`
        )
      }

      // Resolve currency references to addresses and get decimals
      // Supports both symbols ("USDC") and addresses ("0x...")
      // Note: Cadence vault identifiers are already converted by the client layer
      const originCurrency = await resolveCurrency(
        apiUrl,
        originChainId,
        cryptoIntent.sourceCurrency
      )
      const destinationCurrency = await resolveCurrency(
        apiUrl,
        destinationChainId,
        cryptoIntent.currency
      )

      // Convert human-readable amount to base units if provided
      const amountInBaseUnits = cryptoIntent.amount
        ? toBaseUnits(cryptoIntent.amount, originCurrency.decimals)
        : undefined

      // Call Relay API with deposit address mode
      const quote = await callRelayQuote(apiUrl, {
        user: destination.address,
        originChainId: parseInt(originChainId),
        destinationChainId: parseInt(destinationChainId),
        originCurrency: originCurrency.address,
        destinationCurrency: destinationCurrency.address,
        recipient: destination.address,
        amount: amountInBaseUnits,
        tradeType: DEPOSIT_ADDRESS_TRADE_TYPE, // Deposit addresses only work with EXACT_INPUT
        useDepositAddress: true,
        refundTo: destination.address, // Refund to destination address if something fails
        usePermit: false,
        useExternalLiquidity: false,
      })

      // Extract deposit address
      const depositAddress = extractDepositAddress(quote)

      const session: CryptoFundingSession = {
        id: `relay-${Date.now()}`,
        providerId: "relay",
        kind: "crypto",
        instructions: {
          address: depositAddress,
        },
      }

      return session
    },
  }
}
