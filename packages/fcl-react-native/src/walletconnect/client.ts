import {invariant} from "@onflow/util-invariant"
import {CoreTypes} from "@walletconnect/types"
import {SignClient} from "@walletconnect/sign-client"
import {makeServicePlugin, FclWalletConnectConfig as BaseFclWalletConnectConfig} from "@onflow/fcl-wc"
import * as Linking from "expo-linking"
import {createSignClientAdapter} from "./adapters"
import {createRNPlatformAdapter} from "./adapters"

let walletConnectInitialized = false

async function initializeWalletConnect() {
  if (!walletConnectInitialized) {
    // Verify crypto polyfill is available
    if (typeof global.crypto?.getRandomValues !== "function") {
      throw new Error(
        "crypto.getRandomValues is not available. Please import 'react-native-get-random-values' at the top of your app entry point (e.g., app/_layout.tsx or index.js) before any other imports."
      )
    }

    // Import WalletConnect React Native compat
    // This will show a warning about "Application module is not available" which is expected
    try {
      // Temporarily suppress console.error to hide the expected warning
      const originalError = console.error
      console.error = () => {}

      // Use dynamic require with string variable to prevent bundler from analyzing it
      // This avoids TypeScript/Rollup errors during build
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const compatModule = "@walletconnect/react-native-compat"
      require(compatModule)

      // Restore console.error
      console.error = originalError
    } catch (e) {
      // Ignore errors - the polyfills we need are still loaded
    }

    walletConnectInitialized = true
  }
}

/**
 * Configuration for the FCL WalletConnect plugin in React Native.
 */
export interface FclWalletConnectConfig {
  projectId: string
  metadata?: CoreTypes.Metadata
  wcRequestHook?: any
  disableNotifications?: boolean
  wallets?: any[] // Optional array of wallet services to add
}

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "error" // Use "error" for production, "debug" for development

let clientPromise: Promise<any> = Promise.resolve(null)

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
    // Initialize WalletConnect compat first
    await initializeWalletConnect()

    // Auto-detect redirect URI using expo-linking (always available as dependency)
    const redirect = Linking.createURL("")

    // Build metadata
    const clientMetadata = metadata || {
      name: "Flow dapp",
      description: "Flow dapp powered by FCL",
      url: "https://flow.com",
      icons: ["https://avatars.githubusercontent.com/u/62387156?v=4"],
    }

    // Add auto-detected redirect URI
    clientMetadata.redirect = {
      native: redirect,
      universal: redirect,
    } as any

    // SignClient will automatically use @walletconnect/keyvaluestorage
    // which has a React Native version that uses AsyncStorage internally
    const client = await SignClient.init({
      logger: DEFAULT_LOGGER,
      relayUrl: DEFAULT_RELAY_URL,
      projectId: projectId,
      metadata: clientMetadata,
      // NOTE: Don't pass storage parameter, let SignClient use default keyvaluestorage
      // which will automatically use the React Native version with AsyncStorage
    })
    return client
  } catch (error) {
    throw error
  }
}

/**
 * Initialize the FCL WalletConnect plugin lazily for React Native.
 * Uses the shared fcl-wc logic with React Native-specific adapters.
 */
export const initLazy = (config: FclWalletConnectConfig) => {
  // Lazy load the client
  clientPromise = clientPromise
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
      throw e
    })

  // Create client adapter promise that wraps SignClient
  const clientAdapterPromise = clientPromise.then(client => {
    if (!client) return null
    return createSignClientAdapter(client, config.projectId)
  })

  // Create React Native platform adapter
  const platformAdapter = createRNPlatformAdapter()

  // Use the shared fcl-wc makeServicePlugin with our adapters
  const FclWcServicePlugin = makeServicePlugin(clientAdapterPromise as any, {
    projectId: config.projectId,
    metadata: config.metadata,
    wcRequestHook: config.wcRequestHook,
    disableNotifications: config.disableNotifications,
    wallets: config.wallets,
    platformAdapter,
  })

  return {
    FclWcServicePlugin,
    clientPromise,
  }
}

/**
 * Initialize the FCL WalletConnect plugin and wait for the client to be ready.
 */
export const init = async (config: FclWalletConnectConfig) => {
  const {FclWcServicePlugin, clientPromise: clientProm} = initLazy(config)
  const client = await clientProm

  return {
    FclWcServicePlugin,
    client,
  }
}

/**
 * Returns the SignClient instance used by this plugin if it has been initialized.
 */
export async function getClient() {
  return clientPromise.then(client => {
    if (!client) {
      throw new Error("WalletConnect client not initialized")
    }

    return client
  })
}
