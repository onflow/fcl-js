import {
  createFlowClientCore,
  type FlowClientCoreConfig,
  type StorageProvider,
} from "@onflow/fcl-core"
import {getAsyncStorage} from "./utils/react-native/storage"
import {loadFclWc} from "./walletconnect/loader"
import {DISCOVERY_RN_METHOD} from "./utils/react-native/constants"

const PLATFORM = "react-native"

/**
 * Configuration for creating a Flow client on React Native.
 * Extends core configuration with mobile-specific features like WalletConnect.
 */
export interface FlowClientConfig
  extends Omit<
    FlowClientCoreConfig,
    "platform" | "discovery" | "computeLimit" | "storage"
  > {
  // Override to make optional (defaults provided by implementation)
  computeLimit?: number
  storage?: StorageProvider

  // WalletConnect configuration (mobile-specific)
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
}

/**
 * Creates a Flow client instance with authentication, transaction, and query capabilities for React Native.
 *
 * @param params Configuration object for the Flow client
 * @returns A Flow client object with many methods for interacting with the Flow blockchain
 */
export function createFlowClient(params: FlowClientConfig) {
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
    discoveryWalletMethod: params.discoveryWalletMethod || DISCOVERY_RN_METHOD,
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
