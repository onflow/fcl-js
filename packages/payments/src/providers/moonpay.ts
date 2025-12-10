import type {
  FundingProvider,
  FundingIntent,
  FundingSession,
  FiatFundingIntent,
  FiatFundingSession,
  FiatProviderCapability,
} from "../types"
import type {createFlowClientCore} from "@onflow/fcl-core"
import {CAIP} from "../constants"

/**
 * MoonPay provider configuration
 */
export interface MoonPayProviderConfig {
  /** MoonPay publishable API key (starts with pk_test_ for sandbox or pk_live_ for production) */
  publishableApiKey: string
  /** Environment to use for MoonPay widget */
  environment?: "sandbox" | "production"
  /** Optional brand color code (hex format without #) */
  colorCode?: string
  /** Optional redirect URL after payment completion */
  redirectUrl?: string
}

/**
 * MoonPay base URLs by environment
 */
const MOONPAY_BASE_URLS = {
  sandbox: "https://buy-sandbox.moonpay.com",
  production: "https://buy.moonpay.com",
} as const

/**
 * Currency code mapping from EVM addresses to MoonPay currency codes
 * This maps common Flow EVM token addresses to MoonPay's currency codes
 */
const CURRENCY_CODE_MAP: Record<string, string> = {
  // USDC on Flow EVM - you'll need to update this with actual Flow EVM USDC address
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": "usdc_flow",
  // Add more currency mappings as needed
  // FLOW token might not have a direct EVM address but can be specified by symbol
}

/**
 * Default currency code if EVM address not found in map
 */
const DEFAULT_FLOW_CURRENCY = "flow"

/**
 * MoonPay's limits (these are typical values, may vary by currency and region)
 */
const MOONPAY_LIMITS = {
  minAmount: "30",
  maxAmount: "10000",
}

/**
 * Supported payment types on MoonPay
 */
const MOONPAY_PAYMENT_TYPES = [
  "card",
  "bank_transfer",
  "apple_pay",
  "google_pay",
]

/**
 * Extract wallet address from CAIP-10 account identifier
 * Format: namespace:chainId:address (e.g., "eip155:747:0x1234...")
 */
function extractWalletAddress(caip10: string): string {
  const match = caip10.match(CAIP.ACCOUNT_ID_REGEX)
  if (!match) {
    throw new Error(
      `Invalid CAIP-10 account identifier: ${caip10}. Expected format: namespace:chainId:address`
    )
  }

  // Split and get the address part (last segment)
  const parts = caip10.split(":")
  if (parts.length !== 3) {
    throw new Error(`Invalid CAIP-10 format: ${caip10}`)
  }

  return parts[2]
}

/**
 * Map EVM address to MoonPay currency code
 */
function getCurrencyCode(currency: string): string {
  // If it's already a symbol (not an address), return as-is
  if (!/^0x[a-fA-F0-9]{40}$/.test(currency)) {
    return currency.toLowerCase()
  }

  // Look up in currency map
  const normalized = currency.toLowerCase()
  return CURRENCY_CODE_MAP[normalized] || DEFAULT_FLOW_CURRENCY
}

/**
 * Build MoonPay widget URL with parameters
 */
function buildMoonPayUrl(
  config: MoonPayProviderConfig,
  intent: FiatFundingIntent
): string {
  const environment = config.environment || "production"
  const baseUrl = MOONPAY_BASE_URLS[environment]

  const walletAddress = extractWalletAddress(intent.destination)
  const currencyCode = getCurrencyCode(intent.currency)

  const params = new URLSearchParams({
    apiKey: config.publishableApiKey,
    walletAddress,
    currencyCode,
  })

  // Add optional parameters
  if (intent.amount) {
    params.append("baseCurrencyAmount", intent.amount)
  }

  if (config.colorCode) {
    params.append("colorCode", config.colorCode)
  }

  if (config.redirectUrl) {
    params.append("redirectURL", config.redirectUrl)
  }

  if (intent.paymentType) {
    // Map payment type to MoonPay's parameter name
    params.append("paymentMethod", intent.paymentType)
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Create a MoonPay funding provider
 *
 * @param config - MoonPay provider configuration
 * @returns A funding provider factory function
 *
 * @example
 * ```typescript
 * import {moonpayProvider} from "@onflow/payments/providers"
 *
 * const provider = moonpayProvider({
 *   publishableApiKey: "pk_test_...",
 *   environment: "sandbox",
 *   redirectUrl: "https://myapp.com/payment-complete"
 * })
 * ```
 */
export function moonpayProvider(
  config: MoonPayProviderConfig
): (params: {
  flowClient: ReturnType<typeof createFlowClientCore>
}) => FundingProvider {
  if (!config.publishableApiKey) {
    throw new Error("MoonPay publishableApiKey is required")
  }

  if (
    !config.publishableApiKey.startsWith("pk_test_") &&
    !config.publishableApiKey.startsWith("pk_live_")
  ) {
    throw new Error(
      "Invalid MoonPay API key format. Must start with pk_test_ or pk_live_"
    )
  }

  return () => {
    return {
      id: "moonpay",

      async getCapabilities(): Promise<FiatProviderCapability[]> {
        return [
          {
            type: "fiat",
            currencies: [
              DEFAULT_FLOW_CURRENCY,
              ...Object.keys(CURRENCY_CODE_MAP),
            ],
            minAmount: MOONPAY_LIMITS.minAmount,
            maxAmount: MOONPAY_LIMITS.maxAmount,
            paymentTypes: MOONPAY_PAYMENT_TYPES,
          },
        ]
      },

      async startSession(intent: FundingIntent): Promise<FundingSession> {
        if (intent.kind !== "fiat") {
          throw new Error(
            `MoonPay provider only supports fiat funding, got: ${intent.kind}`
          )
        }

        const fiatIntent = intent as FiatFundingIntent

        // Validate destination format
        if (!CAIP.ACCOUNT_ID_REGEX.test(fiatIntent.destination)) {
          throw new Error(
            `Invalid destination format. Expected CAIP-10 format (namespace:chainId:address), got: ${fiatIntent.destination}`
          )
        }

        // Generate session ID (could be enhanced with actual MoonPay transaction tracking)
        const sessionId = `moonpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Build widget URL
        const widgetUrl = buildMoonPayUrl(config, fiatIntent)

        const session: FiatFundingSession = {
          id: sessionId,
          providerId: "moonpay",
          kind: "fiat",
          instructions: {
            url: widgetUrl,
            providerName: "MoonPay",
          },
        }

        return session
      },
    }
  }
}
