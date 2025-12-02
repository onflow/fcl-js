import type {
  FundingIntent,
  FundingSession,
  FundingProvider,
  CryptoFundingIntent,
} from "./types"
import type {createFlowClient} from "@onflow/fcl"
import {FLOW_CHAIN_ID, ADDRESS_PATTERN, type Network} from "./constants"
import {getEvmAddressFromVaultType} from "./bridge-service"

/**
 * Client for creating funding sessions
 */
export interface PaymentsClient {
  /**
   * Create a new funding session based on the provided intent
   * @param intent - The funding intent describing what the user wants to do
   * @returns Promise resolving to a funding session with instructions
   */
  createSession(intent: FundingIntent): Promise<FundingSession>
}

/**
 * Configuration for creating a payments client
 */
export interface PaymentsClientConfig {
  /** Array of funding providers to use (in priority order) */
  providers: FundingProvider[]
  /** Flow client (FCL or SDK) for network detection and Cadence vault ID conversion */
  flowClient: ReturnType<typeof createFlowClient>
}

/**
 * Resolve Flow network from chain ID
 */
function resolveNetwork(chainId: string): Network {
  switch (chainId) {
    case FLOW_CHAIN_ID.MAINNET:
      return "mainnet"
    case FLOW_CHAIN_ID.TESTNET:
      return "testnet"
    case FLOW_CHAIN_ID.LOCAL:
      return "local"
    default:
      throw new Error(`Unknown Flow chain ID: ${chainId}`)
  }
}

/**
 * Check if a currency identifier is a Cadence vault identifier
 */
function isCadenceVaultIdentifier(currency: string): boolean {
  return ADDRESS_PATTERN.CADENCE_VAULT.test(currency)
}

/**
 * Convert Cadence vault identifiers to EVM addresses in a funding intent
 * This allows providers to only deal with EVM addresses and symbols
 */
async function convertCadenceCurrencies(
  intent: FundingIntent,
  flowClient: ReturnType<typeof createFlowClient>,
  network: Network
): Promise<FundingIntent> {
  if (intent.kind !== "crypto") {
    return intent
  }

  const cryptoIntent = intent as CryptoFundingIntent
  let converted = false
  let newCurrency = cryptoIntent.currency
  let newSourceCurrency = cryptoIntent.sourceCurrency

  // Convert destination currency if it's a Cadence vault identifier
  if (isCadenceVaultIdentifier(cryptoIntent.currency)) {
    const evmAddress = await getEvmAddressFromVaultType(
      flowClient,
      cryptoIntent.currency,
      network
    )
    if (!evmAddress) {
      throw new Error(
        `Cadence vault type "${cryptoIntent.currency}" is not bridged to EVM. ` +
          `Make sure the token is onboarded to the Flow EVM Bridge.`
      )
    }
    newCurrency = evmAddress
    converted = true
  }

  // Convert source currency if it's a Cadence vault identifier
  if (isCadenceVaultIdentifier(cryptoIntent.sourceCurrency)) {
    const evmAddress = await getEvmAddressFromVaultType(
      flowClient,
      cryptoIntent.sourceCurrency,
      network
    )
    if (!evmAddress) {
      throw new Error(
        `Cadence vault type "${cryptoIntent.sourceCurrency}" is not bridged to EVM. ` +
          `Make sure the token is onboarded to the Flow EVM Bridge.`
      )
    }
    newSourceCurrency = evmAddress
    converted = true
  }

  if (converted) {
    return {
      ...cryptoIntent,
      currency: newCurrency,
      sourceCurrency: newSourceCurrency,
    }
  }

  return intent
}

/**
 * Create a new payments client
 *
 * @param config - Configuration for the payments client
 * @returns A payments client instance
 *
 * @example
 * ```typescript
 * import {createPaymentsClient, relayProvider} from "@onflow/payments"
 * import * as fcl from "@onflow/fcl"
 *
 * const client = createPaymentsClient({
 *   providers: [relayProvider()],
 *   flowClient: fcl, // Optional: enables Cadence vault ID support
 * })
 *
 * const session = await client.createSession({
 *   kind: "crypto",
 *   destination: "eip155:8453:0xRecipient",
 *   currency: "USDC",
 *   amount: "1000.0",
 *   sourceChain: "eip155:1",
 *   sourceCurrency: "USDC",
 * })
 * ```
 */
export function createPaymentsClient(
  config: PaymentsClientConfig
): PaymentsClient {
  return {
    async createSession(intent) {
      let lastError: unknown = undefined

      // Convert Cadence vault identifiers to EVM addresses
      const chainId = await config.flowClient.getChainId()
      const network = resolveNetwork(chainId)
      const processedIntent = await convertCadenceCurrencies(
        intent,
        config.flowClient,
        network
      )

      for (const provider of config.providers) {
        try {
          return await provider.startSession(processedIntent)
        } catch (e) {
          lastError = e
          continue
        }
      }
      throw lastError ?? new Error("No provider could create a session")
    },
  }
}
