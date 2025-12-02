# @onflow/payments

Minimal, framework‑agnostic Payments core for Flow apps. Provides types and a client for creating funding sessions via pluggable providers.

## Install

```bash
npm i @onflow/payments
```

## Usage

```ts
import { createPaymentsClient, relayProvider } from "@onflow/payments"
import * as fcl from "@onflow/fcl"

const client = createPaymentsClient({
  providers: [relayProvider()],
  flowClient: fcl,
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

## Relay Provider

The built-in `relayProvider` uses [Relay.link](https://relay.link) for cross-chain crypto bridging via deposit addresses.

### Supported Chains

The provider **dynamically fetches** supported chains from [Relay's API](https://docs.relay.link/references/api/get-chains). Example chains:

- Ethereum (`eip155:1`)
- Base (`eip155:8453`)
- Polygon (`eip155:137`)
- Optimism (`eip155:10`)
- Arbitrum (`eip155:42161`)
- **Flow EVM (`eip155:747`)** ✓
- And 35+ more

### How It Works

1. Call `createSession()` with source and destination chain/token details
2. Relay generates a unique deposit address for this specific bridge
3. User sends tokens from the source chain to the deposit address
4. Relay detects the deposit and automatically bridges to the destination

## Development

```bash
# Run unit tests
npm test

# Run integration tests (real API calls)
npm test -- relay.integration.test.ts
```
