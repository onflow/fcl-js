# @onflow/payments

Minimal, framework‑agnostic Payments core for Flow apps. Provides types and a client for creating funding sessions via pluggable providers.

## Install

```bash
npm i @onflow/payments
```

## Usage

### Crypto Funding (Cross-chain)

```ts
import {createPaymentsClient} from "@onflow/payments"
import {createFlowClientCore} from "@onflow/fcl-core"

// Import a provider (e.g., from a separate package or future built-in)
import {relayProvider} from "@onflow/payments/providers"

const flowClient = createFlowClientCore({
  accessNodeUrl: "https://rest-mainnet.onflow.org",
  computeLimit: 100,
  storage: localStorage,
  platform: "web",
})

const client = createPaymentsClient({
  providers: [relayProvider()],
  flowClient,
})

const session = await client.createSession({
  kind: "crypto",
  destination: "eip155:747:0xRecipient", // CAIP-10 format
  currency: "USDC", // Symbol, EVM address, or Cadence vault identifier
  amount: "100.0", // Human-readable decimal format
  sourceChain: "eip155:1", // CAIP-2: source chain
  sourceCurrency: "USDC",
})

// session.instructions contains provider-specific funding instructions
console.log(session.instructions.address) // e.g., deposit address
```

### Fiat Funding (Credit Card, Bank Transfer)

```ts
import {createPaymentsClient} from "@onflow/payments"
import {moonpayProvider} from "@onflow/payments/providers"
import {createFlowClientCore} from "@onflow/fcl-core"

const flowClient = createFlowClientCore({
  accessNodeUrl: "https://rest-mainnet.onflow.org",
  computeLimit: 100,
  storage: localStorage,
  platform: "web",
})

const client = createPaymentsClient({
  providers: [
    moonpayProvider({
      publishableApiKey: "pk_test_...", // Get from MoonPay dashboard
      environment: "sandbox", // or "production"
      redirectUrl: "https://myapp.com/payment-complete", // Optional
      colorCode: "7C3AED", // Optional brand color (hex without #)
    })
  ],
  flowClient,
})

const session = await client.createSession({
  kind: "fiat",
  destination: "eip155:747:0x1234567890123456789012345678901234567890",
  currency: "flow", // or EVM address like "0x..."
  amount: "100.0",
  paymentType: "card", // Optional: "card", "bank_transfer", "apple_pay", "google_pay"
})

// Redirect user to MoonPay widget
window.location.href = session.instructions.url
```

## Core Concepts

### Funding Intent

Describes what the user wants to fund:

```ts
interface CryptoFundingIntent {
  kind: "crypto"
  destination: string // CAIP-10 account identifier
  currency: string // Token symbol, EVM address, or Cadence vault ID
  amount?: string // Human-readable amount (e.g., "100.50")
  sourceChain: string // CAIP-2 chain identifier
  sourceCurrency: string // Source token identifier
}
```

### Funding Session

Returned by providers with instructions for completing the funding:

```ts
interface CryptoFundingSession {
  id: string
  providerId: string
  kind: "crypto"
  instructions: {
    address: string // Where to send funds
    memo?: string // Optional memo/tag
  }
}
```

### Funding Provider

Pluggable interface for different funding mechanisms:

```ts
interface FundingProvider {
  id: string
  getCapabilities(): Promise<ProviderCapability[]>
  startSession(intent: FundingIntent): Promise<FundingSession>
}
```

## Token Formats

The client accepts multiple token identifier formats:

**1. Symbols:**
```ts
currency: "USDC"
```

**2. EVM Addresses (0x + 40 hex):**
```ts
currency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
```

**3. Cadence Vault Identifiers:**
```ts
currency: "A.1654653399040a61.FlowToken.Vault"
```

When you provide a **Cadence vault identifier**, the client queries the **Flow EVM Bridge** to automatically convert the vault ID to the corresponding EVM address before passing to providers.

## Providers

### MoonPay Provider

The MoonPay provider enables fiat-to-crypto on-ramp, allowing users to buy cryptocurrency with credit cards, bank transfers, and other payment methods.

#### Setup

1. Sign up for a MoonPay account at [https://www.moonpay.com](https://www.moonpay.com)
2. Get your publishable API key from the MoonPay dashboard
3. Use `pk_test_...` for sandbox testing or `pk_live_...` for production

#### Configuration

```ts
interface MoonPayProviderConfig {
  publishableApiKey: string // Required: Your MoonPay API key
  environment?: "sandbox" | "production" // Default: "production"
  colorCode?: string // Optional: Brand color in hex (without #)
  redirectUrl?: string // Optional: Callback URL after purchase
}
```

#### Example

```ts
import {createPaymentsClient} from "@onflow/payments"
import {moonpayProvider} from "@onflow/payments/providers"

const client = createPaymentsClient({
  providers: [
    moonpayProvider({
      publishableApiKey: "pk_test_your_key_here",
      environment: "sandbox",
      redirectUrl: "https://myapp.com/complete",
      colorCode: "7C3AED",
    })
  ],
  flowClient,
})

// Create a funding session
const session = await client.createSession({
  kind: "fiat",
  destination: "eip155:747:0xYourFlowEVMAddress",
  currency: "flow",
  amount: "50.00",
  paymentType: "card", // Optional
})

// Redirect to MoonPay widget
window.location.href = session.instructions.url
```

#### Supported Features

- **Currencies**: FLOW, USDC on Flow EVM (via EVM address)
- **Payment Methods**: Credit/debit cards, bank transfers, Apple Pay, Google Pay
- **Amount Limits**: $30 - $10,000 (may vary by region and currency)
- **Environment**: Sandbox for testing, Production for live transactions

#### Currency Mapping

The provider automatically maps:
- Symbol format: `"flow"` → MoonPay's currency code
- EVM addresses: `"0x833589..."` → Mapped to MoonPay currency code
- Unmapped addresses default to `"flow"`

## Development

```bash
npm test
```
