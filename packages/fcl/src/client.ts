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
 * Creates a Flow client instance with authentication, transaction, and query capabilities.
 *
 * @param params Configuration object for the Flow client
 * @returns A Flow client object containing:
 *
 *   - `currentUser` - Current user authentication state and methods
 *   - `mutate` - Execute transactions that modify blockchain state
 *   - `query` - Execute read-only queries against the blockchain
 *   - `queryRaw` - Execute raw queries without decoding
 *   - `tx` - Transaction streaming and monitoring utilities
 *   - `events` - Event streaming and filtering utilities
 *   - `authenticate` - Authenticate the current user
 *   - `unauthenticate` - Sign out the current user
 *   - `signUserMessage` - Sign arbitrary messages with user's account
 *   - `verifyUserSignatures` - Verify signatures from user accounts
 *   - `getChainId` - Get the current Flow network chain ID
 *   - `serialize` - Serialize data for Flow transactions
 *   - Plus additional SDK methods for blockchain interaction
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
