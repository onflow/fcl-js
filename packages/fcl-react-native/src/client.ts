import {
  createFlowClientCore,
  SdkTransport,
  StorageProvider,
} from "@onflow/fcl-core"
import {getAsyncStorage} from "./utils/react-native/storage"
import {loadFclWc} from "./walletconnect/loader"
import {execLocal} from "./utils/react-native/exec-local"

const PLATFORM = "react-native"

export const discoveryOpts = {
  execStrategy: execLocal,
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
 * Creates a Flow client instance with authentication, transaction, and query capabilities for React Native.
 *
 * @param params Configuration object for the Flow client
 * @returns A promise that resolves to a Flow client object with many methods for interacting with the Flow blockchain
 */
export async function createFlowClient(params: FlowClientConfig) {
  // TODO: Load into the global plugin registry for now. This should be
  // refactored to use a plugin registry bound to the client instance in the future.
  // Auto-load WalletConnect plugin when projectId is provided
  loadFclWc({
    walletConnectProjectId: params.walletconnectProjectId,
    walletConnectDisableNotifications: params.walletconnectDisableNotifications,
    appDetailTitle: params.appDetailTitle,
    appDetailIcon: params.appDetailIcon,
    appDetailDescription: params.appDetailDescription,
    appDetailUrl: params.appDetailUrl,
  })

  // Get AsyncStorage for React Native
  const storage = params.storage || getAsyncStorage()

  const fclCore = createFlowClientCore({
    flowNetwork: params.flowNetwork,
    flowJson: params.flowJson,
    accessNodeUrl: params.accessNodeUrl,
    computeLimit: params.computeLimit || 9999,
    transport: params.transport,
    platform: PLATFORM,
    storage,
    discovery: discoveryOpts,
    discoveryWalletMethod: params.discoveryWalletMethod || "POP/RPC",
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
