# @onflow/payments

Minimal, framework‑agnostic Payments core for Flow apps. Provides types and a client for creating funding sessions via pluggable providers.

## Install

```bash
npm i @onflow/payments
```

## Usage

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
  destination: "eip155:747:0xRecipient", // CAIP-10: Flow EVM address
  currency: "USDC", // Symbol, EVM address, or Cadence vault identifier
  amount: "100.0", // Human-readable decimal format
  sourceChain: "eip155:1", // CAIP-2: Ethereum mainnet
  sourceCurrency: "USDC",
})

// session.instructions.address contains a unique deposit address
// User sends USDC on Ethereum to this address, Relay bridges it to Flow EVM
console.log(session.instructions.address)
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

## Development

```bash
npm test
```
