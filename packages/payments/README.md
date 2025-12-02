# @onflow/payments

Minimal, framework‑agnostic Payments core for Flow apps. Provides types and a tiny client for creating funding sessions via pluggable providers.

## Install

```bash
npm i @onflow/payments
```

## Usage

```ts
import {createPaymentsClient, relayProvider} from "@onflow/payments"
import * as fcl from "@onflow/fcl"

const client = createPaymentsClient({
  providers: [relayProvider()],
  flowClient: fcl, // Optional: enables Cadence vault ID support
})

const session = await client.createSession({
  kind: "crypto",
  destination: "eip155:8453:0xRecipient", // CAIP-10: Base address
  currency: "USDC", // Symbol, EVM address, or Cadence vault identifier
  amount: "1000.0", // Human-readable: 1000 USDC (decimals fetched automatically)
  sourceChain: "eip155:1", // CAIP-2: Ethereum mainnet
  sourceCurrency: "USDC", // Symbol or EVM address
})

// session.kind === "crypto"
// session.instructions.address contains a unique deposit address
// User sends USDC on Ethereum to this address, Relay bridges it to Base
```

### Using Different Token Formats

Providers accept multiple token identifier formats:

**1. Symbols:**
```ts
currency: "USDC"
```

**2. EVM Addresses (0x + 40 hex):**
```ts
currency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
```

**3. Cadence Vault Identifiers (requires `flowClient` in client config):**
```ts
currency: "A.1654653399040a61.FlowToken.Vault"
```

When you provide a **Cadence vault identifier** and configure the client with a `flowClient`, it queries the **Flow EVM Bridge** to automatically convert the vault ID to the corresponding EVM address before passing to providers.

### Cadence vs EVM Addresses

Flow has two address formats:
- **Cadence addresses**: `0x` + 16 hex chars (e.g., `0x8c5303eaa26202d6`)
- **EVM addresses**: `0x` + 40 hex chars (e.g., `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`)

The Relay provider **only supports EVM addresses** as destinations. 

**Current behavior**: If you provide a Cadence address, the provider will reject with an error.

**Planned**: Future versions will detect Cadence destinations, automatically route funds to the user's COA (Cadence Owned Account), and provide bridging instructions. See [`CADENCE_ROUTING.md`](./CADENCE_ROUTING.md) for implementation details.

**Workaround for now**:
1. Provide the account's COA EVM address as the destination
2. After funds arrive, use [`@onflow/react-sdk`](https://github.com/onflow/fcl-js/tree/main/packages/react-sdk) hooks like `useCrossVmBridgeTokenFromEvm` to bridge from COA to Cadence

## Supported Chains

The Relay provider **dynamically fetches** supported chains and tokens from [Relay's API](https://docs.relay.link/references/api/get-chains). Call `provider.getCapabilities()` to get the current list.

Example supported chains (as of testing):
- Ethereum (`eip155:1`)
- Base (`eip155:8453`)
- Polygon (`eip155:137`)
- Optimism (`eip155:10`)
- Arbitrum (`eip155:42161`)
- **Flow EVM (`eip155:747`)** ✓
- And 35+ more chains

The provider automatically filters for chains that:
- Have `depositEnabled: true`
- Are not `disabled`
- Have bridgeable ERC-20 currencies

## How it works

1. Call `createSession` with source and destination chain/token details
2. Relay generates a unique deposit address for this specific bridge
3. User sends tokens from the source chain to the deposit address
4. Relay detects the deposit and automatically bridges to the destination

## Development

### Running Tests

```bash
# Run unit tests (mocked, fast)
npm test

# Run integration tests (real API calls, slower)
npm test -- relay.integration.test.ts
```

Integration tests are skipped by default to avoid hitting the real Relay API. To run them, use the command above or remove the `.skip` in `relay.integration.test.ts`.



