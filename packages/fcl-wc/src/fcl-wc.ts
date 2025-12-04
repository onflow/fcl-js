import * as fclCore from "@onflow/fcl-core"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {CoreTypes} from "@walletconnect/types"
import {UniversalProvider} from "@walletconnect/universal-provider"
import {makeServicePlugin} from "./service"
import {PlatformAdapter, WcClientAdapter} from "./types/adapters"
export {getSdkError} from "@walletconnect/utils"

export interface FclWalletConnectConfig {
  projectId: string
  metadata?: CoreTypes.Metadata
  includeBaseWC?: boolean
  wcRequestHook?: any
  pairingModalOverride?: any
  wallets?: any[]
  disableNotifications?: boolean

  // Custom platform adapter for cross-platform support, if not provided, defaults to browser platform adapter
  // React Native should provide its own adapter with Linking.openURL, etc
  platformAdapter?: PlatformAdapter

  // Custom client adapter for cross-platform support, if not provided, defaults to UniversalProvider adapter
  // React Native should provide its own adapter wrapping SignClient
  clientAdapter?: WcClientAdapter | Promise<WcClientAdapter>
}

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "debug"
let providerPromise: Promise<InstanceType<typeof UniversalProvider> | null> =
  Promise.resolve(null)

const initClient = async ({
  projectId,
  metadata,
}: {
  projectId: string
  metadata?: CoreTypes.Metadata
}) => {
  invariant(
    projectId != null,
    "FCL Wallet Connect Error: WalletConnect projectId is required"
  )
  try {
    return UniversalProvider.init({
      logger: DEFAULT_LOGGER,
      relayUrl: DEFAULT_RELAY_URL,
      projectId: projectId,
      metadata: metadata,
    })
  } catch (error) {
    if (error instanceof Error) {
      log({
        title: `${error.name} fcl-wc Init Client`,
        message: error.message,
        level: LEVELS.error,
      })
    }
    throw error
  }
}

export const initLazy = (config: FclWalletConnectConfig) => {
  const {FclWcServicePlugin, providerPromise: provPromise} = initHelper(config)

  // Only call authn.update() in browser environments
  // React Native provides its own clientAdapter and doesn't have document
  if (!config.clientAdapter && typeof document !== "undefined") {
    fclCore.discovery.authn.update()
  }

  return {
    FclWcServicePlugin,
    providerPromise: provPromise,
  }
}

export const init = async (config: FclWalletConnectConfig) => {
  const {FclWcServicePlugin, providerPromise: provPromise} = initLazy(config)
  const client = await provPromise

  // Only call authn.update() in browser environments
  if (!config.clientAdapter && typeof document !== "undefined") {
    fclCore.discovery.authn.update()
  }

  return {
    FclWcServicePlugin,
    client,
  }
}

const initHelper = (config: FclWalletConnectConfig) => {
  // If a custom client adapter is provided (e.g., React Native SignClient),
  // use it directly instead of initializing UniversalProvider.
  // This allows React Native to provide a lazy-loaded client promise.
  if (config.clientAdapter) {
    // Handle both Promise<WcClientAdapter> and WcClientAdapter
    const clientAdapterPromise = Promise.resolve(config.clientAdapter)

    const FclWcServicePlugin = makeServicePlugin(clientAdapterPromise, config)

    return {
      FclWcServicePlugin,
      // Return the clientAdapter promise so callers can await it
      providerPromise: clientAdapterPromise,
    }
  }

  // Standard web initialization with UniversalProvider
  if (typeof window === "undefined") {
    throw new Error(
      "FCL Wallet Connect Plugin can only be initialized in the browser"
    )
  }

  // Lazy load the SignClient
  //  - Initialize the client if it doesn't exist
  //  - If it does exist, return existing client
  //  - If existing client fails to initialize, reinitialize
  providerPromise = providerPromise
    .catch(() => null)
    .then(_client => {
      if (_client) {
        return _client
      } else {
        return initClient({
          projectId: config.projectId,
          metadata: config.metadata,
        })
      }
    })
    .catch(e => {
      log({
        title: `WalletConnect Client Initialization Error`,
        message: e.message ? e.message : e,
        level: LEVELS.error,
      })
      throw e
    })

  const FclWcServicePlugin = makeServicePlugin(providerPromise, config)

  return {
    FclWcServicePlugin,
    providerPromise,
  }
}

// Returns the SignClient instance used by this plugin if it has been initialized
export async function getProvider() {
  return providerPromise.then(provider => {
    if (!provider) {
      throw new Error("WalletConnect client not initialized")
    }

    return provider
  })
}

export {SERVICE_PLUGIN_NAME} from "./constants"
