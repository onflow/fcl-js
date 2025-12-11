import type {
  FundingProvider,
  FundingProviderFactory,
  FundingIntent,
  FundingSession,
  CryptoFundingIntent,
  CryptoFundingSession,
  ProviderCapability,
} from "../types"
import type {createFlowClientCore} from "@onflow/fcl-core"
import {parseCAIP2, parseCAIP10} from "../utils/caip"
import {isEvmAddress, isCadenceAddress} from "../utils/address"
import {getFlowEvmChainId} from "../utils/network"
import {getCoaAddress} from "../bridge-service"

/**
 * Configuration for the Relay funding provider
 */
export interface RelayConfig {
  /** Optional custom Relay API URL (defaults to `https://api.relay.link`) */
  apiUrl?: string
}

interface RelayQuoteRequest {
  user: string
  originChainId: string | number
  destinationChainId: string | number
  originCurrency: string
  destinationCurrency: string
  recipient: string
  amount?: string
  tradeType?: "EXACT_INPUT" | "EXACT_OUTPUT"
  useDepositAddress?: boolean
  refundTo?: string
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
    depositAddress?: string
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

const DEFAULT_RELAY_API_URL = "https://api.relay.link"
const DEPOSIT_ADDRESS_TRADE_TYPE = "EXACT_INPUT" as const

/**
 * Create a Relay funding provider factory
 *
 * Relay is a cross-chain bridging protocol that enables crypto funding
 * via deposit addresses. Users send funds on one chain, and Relay automatically
 * bridges them to the destination chain.
 *
 * @param config - Optional configuration for the Relay provider
 * @returns A funding provider factory that will be initialized by the payments client
 *
 * @example
 * ```typescript
 * import {createPaymentsClient} from "@onflow/payments"
 * import {relayProvider} from "@onflow/payments/providers"
 * import {createFlowClientCore} from "@onflow/fcl-core"
 *
 * const flowClient = createFlowClientCore({ ... })
 *
 * const client = createPaymentsClient({
 *   providers: [relayProvider()], // flowClient injected automatically
 *   flowClient,
 * })
 * ```
 */
export function relayProvider(
  config: RelayConfig = {}
): FundingProviderFactory {
  const apiUrl = config.apiUrl || DEFAULT_RELAY_API_URL

  return ({
    flowClient,
  }: {
    flowClient: ReturnType<typeof createFlowClientCore>
  }): FundingProvider => ({
    id: "relay",

    async getCapabilities(): Promise<ProviderCapability[]> {
      try {
        // Derive Flow EVM chain ID from the flow client
        const flowEvmChainId = await getFlowEvmChainId(flowClient)

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

        // Collect currencies from Flow EVM (destination)
        // These are the tokens that can be received on Flow
        const flowCurrencies = new Set<string>()

        chains.forEach(chain => {
          const isFlowEVM = chain.id === flowEvmChainId

          if (isFlowEVM) {
            // Add ERC20 currencies from Flow
            if (chain.erc20Currencies) {
              chain.erc20Currencies.forEach(currency => {
                if (currency.supportsBridging) {
                  flowCurrencies.add(currency.symbol)
                }
              })
            }
            // Also check featured tokens
            if (chain.featuredTokens) {
              chain.featuredTokens.forEach(token => {
                flowCurrencies.add(token.symbol)
              })
            }
          }
        })

        // sourceCurrencies should match destination currencies
        // You can only bridge tokens that exist on Flow
        const flowCurrenciesArray = Array.from(flowCurrencies)

        return [
          {
            type: "crypto",
            sourceChains: supportedChains,
            currencies: flowCurrenciesArray,
            // Query chain-specific source currencies dynamically
            getCurrenciesForChain: async (sourceChain: string) => {
              try {
                const {chainId} = parseCAIP2(sourceChain)
                const currencies = await getRelayCurrencies(apiUrl, chainId)
                return currencies.map(c => c.address)
              } catch (error) {
                console.error(
                  `Failed to fetch currencies for chain ${sourceChain}:`,
                  error
                )
                return []
              }
            },
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
      const {chainId: originChainId} = parseCAIP2(cryptoIntent.sourceChain)

      // Parse destination
      const destination = parseCAIP10(cryptoIntent.destination)
      const destinationChainId = toRelayChainId(
        destination.namespace,
        destination.chainId
      )

      // Detect if destination is Cadence and convert to COA EVM address
      const isCadenceDestination = isCadenceAddress(destination.address)
      let actualDestination = destination.address

      if (isCadenceDestination) {
        // Fetch the user's COA (Cadence Owned Account) EVM address
        const coaAddress = await getCoaAddress({
          flowClient,
          cadenceAddress: destination.address,
        })

        if (!coaAddress) {
          throw new Error(
            `No COA (Cadence Owned Account) found for ${destination.address}. ` +
              `Please ensure the account has a COA set up at /public/evm.`
          )
        }

        actualDestination = coaAddress
      }

      if (!isEvmAddress(actualDestination)) {
        throw new Error(
          `Invalid EVM address format: ${actualDestination}. ` +
            `Expected 0x followed by 40 hexadecimal characters.`
        )
      }

      // Resolve currency references to addresses and get decimals
      // Only supports EVM addresses ("0x...")
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
        usePermit: false,
        useExternalLiquidity: false,
      })

      // Extract deposit address and request ID
      const {depositAddress, requestId} = extractDepositInfo(quote)

      const session: CryptoFundingSession = {
        id: requestId,
        providerId: "relay",
        kind: "crypto",
        instructions: {
          address: depositAddress,
        },
      }

      return session
    },
  })
}

function toRelayChainId(namespace: string, chainId: string): string {
  // For EVM chains, Relay uses numeric chain IDs
  return chainId
}

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

  // Must be an EVM address (0x + 40 hex chars)
  if (!isEvmAddress(currency)) {
    throw new Error(
      `Invalid currency format: "${currency}". ` +
        `Relay requires EVM token addresses (0x + 40 hex chars). ` +
        `Token symbols (e.g., "USDC", "USDF") are not supported. ` +
        `Please provide the full EVM address or Cadence vault identifier.`
    )
  }

  // Find the address in the currency list to get decimals
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

function extractDepositInfo(quote: RelayQuoteResponse): {
  depositAddress: string
  requestId: string
} {
  // Look for a step with depositAddress field
  for (const step of quote.steps) {
    if (step.depositAddress) {
      return {
        depositAddress: step.depositAddress,
        requestId: step.requestId || `relay-${Date.now()}`, // Fallback to generated ID
      }
    }
  }

  throw new Error(
    `No deposit address found in Relay quote response. Ensure useDepositAddress is set to true.`
  )
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
