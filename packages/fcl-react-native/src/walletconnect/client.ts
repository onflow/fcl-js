import {CoreTypes} from "@walletconnect/types"
import {
  makeServicePlugin,
  createSignClientAdapter,
  createRNPlatformAdapter,
  initializeSignClient,
} from "@onflow/fcl-wc/react-native"

// Configuration for the FCL WalletConnect plugin in React Native
export interface FclWalletConnectConfig {
  projectId: string
  metadata?: CoreTypes.Metadata
  wcRequestHook?: any
  disableNotifications?: boolean
  wallets?: any[]
}

// Store the client adapter promise for getClient()
let clientAdapterPromise: Promise<any> | null = null

// Initialize the FCL WalletConnect plugin lazily for React Native
export const initLazy = (config: FclWalletConnectConfig) => {
  clientAdapterPromise = initializeSignClient({
    projectId: config.projectId,
    metadata: config.metadata,
  }).then(client => createSignClientAdapter(client, config.projectId))

  // Create service plugin with RN adapters
  const FclWcServicePlugin = makeServicePlugin(clientAdapterPromise, {
    projectId: config.projectId,
    metadata: config.metadata,
    wcRequestHook: config.wcRequestHook,
    disableNotifications: config.disableNotifications,
    wallets: config.wallets,
    platformAdapter: createRNPlatformAdapter(),
  })

  return {
    FclWcServicePlugin,
    clientPromise: clientAdapterPromise,
  }
}

// Initialize the FCL WalletConnect plugin and wait for the client to be ready
export const init = async (config: FclWalletConnectConfig) => {
  const {FclWcServicePlugin, clientPromise} = initLazy(config)
  const client = await clientPromise

  return {
    FclWcServicePlugin,
    client,
  }
}

export async function getClient() {
  if (!clientAdapterPromise) {
    throw new Error("WalletConnect client not initialized")
  }
  return clientAdapterPromise
}
