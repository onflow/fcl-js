import type {FundingIntent, FundingSession, FundingProvider} from "./types"
import type {createFlowClientCore} from "@onflow/fcl-core"
import {ADDRESS_PATTERN} from "./constants"
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
  /** Flow client (FCL Core or SDK) for Cadence vault ID conversion */
  flowClient: ReturnType<typeof createFlowClientCore>
}

/**
 * Check if a currency identifier is a Cadence vault identifier
 */
function isCadenceVaultIdentifier(currency: string): boolean {
  return ADDRESS_PATTERN.CADENCE_VAULT.test(currency)
}

/**
 * Convert Cadence vault identifiers to EVM addresses in a funding intent
 */
async function convertCadenceCurrencies(
  intent: FundingIntent,
  flowClient: ReturnType<typeof createFlowClientCore>
): Promise<FundingIntent> {
  if (!isCadenceVaultIdentifier(intent.currency)) {
    return intent
  }

  const evmAddress = await getEvmAddressFromVaultType({
    flowClient,
    vaultIdentifier: intent.currency,
  })
  if (!evmAddress) {
    throw new Error(
      `Cadence vault type "${intent.currency}" is not bridged to EVM. ` +
        `Make sure the token is onboarded to the Flow EVM Bridge.`
    )
  }
  return {...intent, currency: evmAddress}
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
 * import {createFlowClientCore} from "@onflow/fcl-core"
 *
 * const flowClient = createFlowClientCore({...})
 * const client = createPaymentsClient({
 *   providers: [relayProvider()],
 *   flowClient,
 * })
 *
 * // Using EVM addresses
 * const session = await client.createSession({
 *   kind: "crypto",
 *   destination: "eip155:747:0xRecipient",
 *   currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Flow EVM
 *   amount: "100.0",
 *   sourceChain: "eip155:1",
 *   sourceCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC on Ethereum
 * })
 *
 * // Or using Cadence vault identifiers (auto-converted to EVM)
 * const session2 = await client.createSession({
 *   kind: "crypto",
 *   destination: "eip155:747:0xRecipient",
 *   currency: "A.1654653399040a61.FlowToken.Vault",
 *   amount: "10.0",
 *   sourceChain: "eip155:1",
 *   sourceCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
 * })
 * ```
 */
export function createPaymentsClient(
  config: PaymentsClientConfig
): PaymentsClient {
  return {
    async createSession(intent) {
      // Convert Cadence vault identifiers to EVM addresses
      const processedIntent = await convertCadenceCurrencies(
        intent,
        config.flowClient
      )

      const providerErrors: {id?: string; error: any}[] = []
      for (const provider of config.providers) {
        try {
          return await provider.startSession(processedIntent)
        } catch (err) {
          providerErrors.push({
            id: provider.id,
            error: err instanceof Error ? err.message : String(err),
          })
          continue
        }
      }
      const errorDetails = providerErrors
        .map((e, idx) => `Provider ${e.id ?? idx}: ${e.error}`)
        .join("; ")
      throw new Error(
        `Failed to create session: no provider could handle the request. Errors: ${errorDetails}`
      )
    },
  }
}
