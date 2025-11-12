import {
  createFlowClientCore,
  SdkTransport,
  StorageProvider,
} from "@onflow/fcl-core"
import {LOCAL_STORAGE} from "./fcl"
import {execStrategyHook} from "./discovery/exec-hook"
import {loadFclWc} from "./utils/walletconnect/loader"

const PLATFORM = "web"

export const discoveryOpts = {
  execStrategy: execStrategyHook,
}

export interface FlowClientConfig {
  // Core network configuration (most commonly used)
  accessNodeUrl: string // Required - must specify which network to connect to
  flowNetwork?: string
  flowJson?: any

  // Wallet/Discovery configuration
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  discoveryAuthnInclude?: string[]
  discoveryAuthnExclude?: string[]

  // WalletConnect configuration
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean

  // Storage configuration
  storage?: StorageProvider

  // App detail properties
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string

  // Service configuration
  serviceOpenIdScopes?: string[]

  // Advanced/SDK configuration (least commonly used)
  transport?: SdkTransport
  computeLimit?: number
  customResolver?: any
  customDecoders?: any
}

/**
 * Creates a Flow client instance with scoped configuration.
 *
 * This function decouples FCL functions from the global state and constructs a new SDK client
 * instance bound to a custom context. This allows for better modularity and supports multiple
 * FCL instances in the same application, each with their own isolated configuration and state.
 *
 * Benefits of scoped configuration:
 * - **Isolation**: Each client has its own configuration, storage, and state
 * - **Multi-tenancy**: Connect to different Flow networks simultaneously
 * - **Type Safety**: Configuration is validated at compile time via TypeScript
 * - **Testing**: Easy to create isolated client instances for testing
 *
 * @param params Configuration object for the Flow client
 * @returns A Flow client object with methods for interacting with the Flow blockchain
 *
 * @example
 * // Basic client setup
 * import { createFlowClient } from "@onflow/fcl"
 *
 * const flowClient = createFlowClient({
 *   accessNodeUrl: "https://rest-testnet.onflow.org",
 *   flowNetwork: "testnet",
 *   discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
 *   appDetailTitle: "My Flow App",
 * })
 *
 * // Authenticate user
 * await flowClient.authenticate()
 *
 * // Query the blockchain
 * const result = await flowClient.query({
 *   cadence: `access(all) fun main(): UFix64 { return getCurrentBlock().timestamp }`,
 * })
 *
 * // Send a transaction
 * const txId = await flowClient.mutate({
 *   cadence: `
 *     transaction {
 *       execute {
 *         log("Hello, Flow!")
 *       }
 *     }
 *   `,
 * })
 *
 * @example
 * // Multiple isolated clients for different networks
 * import { createFlowClient } from "@onflow/fcl"
 *
 * const mainnetClient = createFlowClient({
 *   accessNodeUrl: "https://rest-mainnet.onflow.org",
 *   flowNetwork: "mainnet",
 *   appDetailTitle: "My App (Mainnet)",
 * })
 *
 * const testnetClient = createFlowClient({
 *   accessNodeUrl: "https://rest-testnet.onflow.org",
 *   flowNetwork: "testnet",
 *   appDetailTitle: "My App (Testnet)",
 * })
 *
 * // Query both networks simultaneously
 * const [mainnetBlock, testnetBlock] = await Promise.all([
 *   mainnetClient.query({
 *     cadence: `access(all) fun main(): UInt64 { return getCurrentBlock().height }`,
 *   }),
 *   testnetClient.query({
 *     cadence: `access(all) fun main(): UInt64 { return getCurrentBlock().height }`,
 *   }),
 * ])
 */
export function createFlowClient(params: FlowClientConfig) {
  // TODO: Load into the global plugin registry for now.  This should be
  // refactored to use a plugin registry bound to the client instance
  // in the future.
  loadFclWc({
    walletConnectProjectId: params.walletconnectProjectId,
    walletConnectDisableNotifications: params.walletconnectDisableNotifications,
    appDetailTitle: params.appDetailTitle,
    appDetailIcon: params.appDetailIcon,
    appDetailDescription: params.appDetailDescription,
    appDetailUrl: params.appDetailUrl,
  })

  const fclCore = createFlowClientCore({
    flowNetwork: params.flowNetwork,
    flowJson: params.flowJson,
    accessNodeUrl: params.accessNodeUrl,
    computeLimit: params.computeLimit || 9999,
    transport: params.transport,
    platform: PLATFORM,
    storage: params.storage || LOCAL_STORAGE,
    discovery: discoveryOpts,
    discoveryWalletMethod: params.discoveryWalletMethod || "IFRAME/RPC",
    discoveryAuthnEndpoint: params.discoveryAuthnEndpoint,
    discoveryAuthnInclude: params.discoveryAuthnInclude,
    discoveryAuthnExclude: params.discoveryAuthnExclude,
    customResolver: params.customResolver,
    customDecoders: params.customDecoders,
    discoveryWallet: params.discoveryWallet,
    appDetailTitle: params.appDetailTitle,
    appDetailIcon: params.appDetailIcon,
    appDetailDescription: params.appDetailDescription,
    appDetailUrl: params.appDetailUrl,
    serviceOpenIdScopes: params.serviceOpenIdScopes,
  })

  return {
    ...fclCore,
  }
}
