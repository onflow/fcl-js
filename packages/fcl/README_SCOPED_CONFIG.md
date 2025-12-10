# Scoped Configuration in FCL

## Overview

FCL now supports **scoped configuration** through the `createFlowClient()` API. This allows you to create isolated Flow client instances, each with their own configuration, storage, and state. This is a modern alternative to the traditional global configuration approach.

### When to Use Scoped Config

- **Multi-tenant applications**: Different users or organizations connecting to different Flow networks
- **Server-side rendering**: Each request needs its own isolated client instance
- **Testing**: Create mock clients with specific configurations
- **Multi-network support**: Connect to mainnet and testnet simultaneously
- **Modern applications**: Better isolation and type safety for new projects

## Quick Start

```typescript
import { createFlowClient } from "@onflow/fcl"

// Create a Flow client with scoped configuration
const flowClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  flowNetwork: "testnet",
  appDetailTitle: "My Flow App",
  appDetailIcon: "https://example.com/icon.png",
  discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
})

// Authenticate a user
await flowClient.authenticate()

// Query the blockchain
const result = await flowClient.query({
  cadence: `access(all) fun main(): UFix64 { return getCurrentBlock().timestamp }`,
})

// Send a transaction
const txId = await flowClient.mutate({
  cadence: `
    transaction {
      execute {
        log("Hello, Flow!")
      }
    }
  `,
})

// Wait for transaction to be sealed
const status = await flowClient.tx(txId).onceSealed()
```

## Benefits of Scoped Config

| Feature | Global Config | Scoped Config |
|---------|--------------|---------------|
| **Isolation** | Single global state | Per-client instance, fully isolated |
| **Multi-tenancy** | Not supported | Multiple clients with different configs |
| **Type Safety** | Runtime strings | TypeScript interfaces at compile time |
| **Testing** | Difficult to isolate | Easy to mock and test |
| **SSR** | Shared state issues | Each request gets own instance |
| **Concurrency** | Actor-based message queue | Direct synchronous access |

## Configuration Options

The `createFlowClient()` function accepts a configuration object with the following options:

### Required Options

```typescript
{
  accessNodeUrl: string  // Flow Access Node API endpoint
}
```

### Network Configuration

```typescript
{
  accessNodeUrl: string           // Required - Flow Access Node API endpoint
  flowNetwork: "mainnet" | "testnet" | "emulator" | string  // Network identifier
  flowJson?: FlowJSON             // Optional - Contract addresses from flow.json
}
```

### Wallet & Discovery Configuration

```typescript
{
  discoveryWallet?: string        // Discovery service URL for wallet connection
  discoveryWalletMethod?: string  // Connection method (e.g., "IFRAME/RPC")
  discoveryAuthnEndpoint?: string // Custom authentication endpoint
  discoveryAuthnInclude?: string[] // Wallet providers to include
}
```

### WalletConnect Configuration

```typescript
{
  walletconnectProjectId?: string           // WalletConnect Cloud project ID
  walletconnectDisableNotifications?: boolean  // Disable WalletConnect notifications
}
```

### App Details

These details are displayed to users during wallet connection:

```typescript
{
  appDetailTitle?: string       // Your app's name
  appDetailIcon?: string        // URL to your app's icon
  appDetailDescription?: string // Short description of your app
  appDetailUrl?: string         // Your app's website URL
}
```

### Advanced Configuration

```typescript
{
  storage?: Storage              // Custom storage provider (defaults to localStorage)
  transport?: Transport          // Custom transport layer for network requests
  computeLimit?: number          // Default gas limit for transactions (default: 9999)
  customResolver?: Resolver      // Custom address resolver
  customDecoders?: Decoder[]     // Custom Cadence type decoders
  serviceOpenIdScopes?: string[] // OpenID scopes for authentication
}
```

## Usage Examples

### Basic Client Usage

```typescript
import { createFlowClient } from "@onflow/fcl"

const flowClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  flowNetwork: "testnet",
})

// Get current user
const currentUser = flowClient.currentUser()

// Subscribe to authentication state changes
currentUser.subscribe((user) => {
  console.log("Current user:", user)
})

// Authenticate
await flowClient.authenticate()

// Get user info
const user = currentUser.snapshot()
console.log("User address:", user.addr)
```

### Querying the Blockchain

```typescript
// Simple query
const result = await flowClient.query({
  cadence: `
    access(all) fun main(): String {
      return "Hello, Flow!"
    }
  `,
})

// Query with arguments
const balance = await flowClient.query({
  cadence: `
    access(all) fun main(address: Address): UFix64 {
      return getAccount(address).balance
    }
  `,
  args: (arg, t) => [arg("0x1234567890abcdef", t.Address)],
})

// Query with custom limit
const blockData = await flowClient.query({
  cadence: `access(all) fun main(): UInt64 { return getCurrentBlock().height }`,
  limit: 1000,
})
```

### Sending Transactions

```typescript
// Send a transaction
const txId = await flowClient.mutate({
  cadence: `
    transaction(greeting: String) {
      execute {
        log(greeting)
      }
    }
  `,
  args: (arg, t) => [arg("Hello, Flow!", t.String)],
  limit: 9999,
})

// Monitor transaction status
const unsub = flowClient.tx(txId).subscribe((txStatus) => {
  console.log("Status:", txStatus.status)

  if (txStatus.status === 4) {
    console.log("Transaction sealed!")
    unsub() // Unsubscribe
  }
})

// Or wait for specific status
await flowClient.tx(txId).onceSealed()
```

### Multiple Isolated Clients

You can create multiple Flow clients, each with their own configuration:

```typescript
import { createFlowClient } from "@onflow/fcl"

// Mainnet client
const mainnetClient = createFlowClient({
  accessNodeUrl: "https://rest-mainnet.onflow.org",
  flowNetwork: "mainnet",
  appDetailTitle: "My App (Mainnet)",
})

// Testnet client
const testnetClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  flowNetwork: "testnet",
  appDetailTitle: "My App (Testnet)",
})

// Query both networks simultaneously
const [mainnetBlock, testnetBlock] = await Promise.all([
  mainnetClient.query({
    cadence: `access(all) fun main(): UInt64 { return getCurrentBlock().height }`,
  }),
  testnetClient.query({
    cadence: `access(all) fun main(): UInt64 { return getCurrentBlock().height }`,
  }),
])

console.log("Mainnet block:", mainnetBlock)
console.log("Testnet block:", testnetBlock)
```

### Using with flow.json

If you have a `flow.json` file with contract addresses, you can pass it to the client:

```typescript
import flowJsonData from "./flow.json"

const flowClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  flowNetwork: "testnet",
  flowJson: flowJsonData,
})

// Contract addresses will be automatically resolved
// based on the network configuration
```

### Custom Storage Provider

By default, FCL uses `localStorage` for web environments. You can provide a custom storage implementation:

```typescript
const customStorage = {
  async getItem(key: string): Promise<string | null> {
    // Your custom storage logic
    return await myDatabase.get(key)
  },
  async setItem(key: string, value: string): Promise<void> {
    // Your custom storage logic
    await myDatabase.set(key, value)
  },
  async removeItem(key: string): Promise<void> {
    // Your custom storage logic
    await myDatabase.delete(key)
  },
}

const flowClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  storage: customStorage,
})
```

## Config Key Mapping

When you pass typed parameters to `createFlowClient()`, they are internally mapped to config keys. Here's the mapping:

| Typed Parameter | Internal Config Key |
|----------------|---------------------|
| `accessNodeUrl` | `accessNode.api` |
| `flowNetwork` | `flow.network` |
| `computeLimit` | `fcl.limit` |
| `discoveryWallet` | `discovery.wallet` |
| `discoveryWalletMethod` | `discovery.wallet.method` |
| `discoveryAuthnEndpoint` | `discovery.authn.endpoint` |
| `discoveryAuthnInclude` | `discovery.authn.include` |
| `appDetailTitle` | `app.detail.title` |
| `appDetailIcon` | `app.detail.icon` |
| `appDetailDescription` | `app.detail.description` |
| `appDetailUrl` | `app.detail.url` |
| `serviceOpenIdScopes` | `service.OpenID.scopes` |

## Config Service API

Each Flow client has an internal config service that manages its configuration. While typically you don't need to access this directly, it's available for advanced use cases.

The config service provides the following methods:

```typescript
interface ConfigService {
  // Get a configuration value
  get(key: string, defaultValue?: any): Promise<any>

  // Set a configuration value
  put(key: string, value: any): Promise<ConfigService> | ConfigService

  // Update a configuration value with a function
  update(key: string, updateFn: (oldValue: any) => any): Promise<ConfigService> | ConfigService

  // Delete a configuration value
  delete(key: string): Promise<ConfigService> | ConfigService

  // Get all config values matching a pattern
  where(pattern: RegExp): Promise<Record<string, any>>

  // Get the first defined value from a list of keys
  first(keys: string[], defaultValue?: any): Promise<any> | any

  // Subscribe to configuration changes
  subscribe(callback: (config: Record<string, any> | null) => void): () => void

  // Get all configuration values
  all(): Promise<Record<string, any>>
}
```

## Migration from Global Config

If you're currently using the global config approach, here's how to migrate to scoped config:

### Before (Global Config)

```typescript
import * as fcl from "@onflow/fcl"

// Configure globally
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("app.detail.title", "My App")

// Use global functions
await fcl.authenticate()
const result = await fcl.query({ cadence: script })
```

### After (Scoped Config)

```typescript
import { createFlowClient } from "@onflow/fcl"

// Create scoped client
const flowClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
  appDetailTitle: "My App",
})

// Use client methods
await flowClient.authenticate()
const result = await flowClient.query({ cadence: script })
```

### Key Differences

1. **Import**: Import `createFlowClient` instead of using the global `fcl` namespace
2. **Configuration**: Pass all config as an object to `createFlowClient()` instead of using `fcl.config().put()`
3. **Method calls**: Use methods on the `flowClient` instance instead of global functions
4. **Isolation**: Each client instance is isolated; no shared global state

### Gradual Migration

Both approaches can coexist in the same application, allowing for gradual migration:

```typescript
import * as fcl from "@onflow/fcl"
import { createFlowClient } from "@onflow/fcl"

// Existing global config still works
fcl.config().put("accessNode.api", "https://rest-mainnet.onflow.org")

// New scoped client for a specific feature
const testnetClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
})

// Both work independently
await fcl.query({ cadence: mainnetScript })  // Uses global config
await testnetClient.query({ cadence: testnetScript })  // Uses scoped config
```

## Important Notes

1. **Storage**: By default, scoped config uses `localStorage` for web environments. For Node.js or custom storage needs, provide a custom storage implementation.

2. **WalletConnect**: The WalletConnect plugin currently loads into a global registry. This may affect isolation when using multiple clients with different WalletConnect configurations.

3. **Backward Compatibility**: The global config approach is still supported and continues to work. Scoped config is recommended for new applications.

4. **Type Safety**: Scoped config provides better type safety through TypeScript interfaces, catching configuration errors at compile time rather than runtime.

5. **Testing**: Scoped config makes testing easier by allowing you to create isolated client instances with specific configurations for each test.

6. **Performance**: Scoped config uses a simple `Map` for storage, providing synchronous access without the message-passing overhead of the global actor-based system.

## Complete Example

Here's a complete example demonstrating a real-world application:

```typescript
import { createFlowClient } from "@onflow/fcl"

// Create the Flow client
const flowClient = createFlowClient({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  flowNetwork: "testnet",
  discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
  walletconnectProjectId: "your-project-id",
  appDetailTitle: "My Flow App",
  appDetailIcon: "https://myapp.com/icon.png",
  appDetailDescription: "A decentralized application on Flow",
  appDetailUrl: "https://myapp.com",
  computeLimit: 9999,
})

// Get current user service
const currentUser = flowClient.currentUser()

// Subscribe to authentication state
currentUser.subscribe((user) => {
  if (user.loggedIn) {
    console.log("User logged in:", user.addr)
    loadUserData(user.addr)
  } else {
    console.log("User logged out")
  }
})

// Authentication functions
async function login() {
  await flowClient.authenticate()
}

async function logout() {
  await flowClient.unauthenticate()
}

// Query user's NFTs
async function getUserNFTs(address: string) {
  return await flowClient.query({
    cadence: `
      import NonFungibleToken from 0xNFTAddress

      access(all) fun main(address: Address): [UInt64] {
        let account = getAccount(address)
        let collectionRef = account.getCapability(/public/NFTCollection)
          .borrow<&{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow collection")

        return collectionRef.getIDs()
      }
    `,
    args: (arg, t) => [arg(address, t.Address)],
  })
}

// Transfer an NFT
async function transferNFT(recipient: string, nftId: number) {
  const txId = await flowClient.mutate({
    cadence: `
      import NonFungibleToken from 0xNFTAddress

      transaction(recipient: Address, nftId: UInt64) {
        execute {
          // Transfer logic here
        }
      }
    `,
    args: (arg, t) => [
      arg(recipient, t.Address),
      arg(nftId.toString(), t.UInt64),
    ],
    limit: 9999,
  })

  // Wait for transaction to be sealed
  const result = await flowClient.tx(txId).onceSealed()

  if (result.statusCode === 0) {
    console.log("NFT transferred successfully!")
  } else {
    console.error("Transfer failed:", result.errorMessage)
  }

  return result
}
```

## Additional Resources

- [FCL Documentation](https://developers.flow.com/tools/fcl-js)
- [Flow Access API](https://developers.flow.com/http-api)
- [Cadence Language Reference](https://developers.flow.com/cadence/language)
- [Flow Developer Portal](https://developers.flow.com/)
