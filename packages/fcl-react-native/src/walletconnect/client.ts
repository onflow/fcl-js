import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {CoreTypes} from "@walletconnect/types"
import {makeServicePlugin} from "./service"

// NOTE: WalletConnect modules are imported lazily in initClient() to ensure
// crypto polyfill (react-native-get-random-values) is loaded first from app/_layout.tsx

let walletConnectInitialized = false

async function initializeWalletConnect() {
  if (!walletConnectInitialized) {
    // Verify crypto polyfill is available
    if (typeof global.crypto?.getRandomValues !== "function") {
      throw new Error(
        "crypto.getRandomValues is not available. Please import 'react-native-get-random-values' at the top of your app entry point (e.g., app/_layout.tsx or index.js) before any other imports."
      )
    }

    // Import WalletConnect React Native compat (ignore "Application module" warning)
    try {
      await import("@walletconnect/react-native-compat")
    } catch (e) {
      // Ignore "Application module is not available" warning
      // The polyfills we need are still loaded
    }

    walletConnectInitialized = true
  }
}

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

  console.log("=== Initializing WalletConnect SignClient")

  try {
    // Initialize WalletConnect compat first
    await initializeWalletConnect()

    // Dynamically import SignClient after compat is loaded
    const {SignClient} = await import("@walletconnect/sign-client")

    console.log("=== WalletConnect modules loaded, calling SignClient.init")

    // SignClient will automatically use @walletconnect/keyvaluestorage
    // which has a React Native version that uses AsyncStorage internally
    const client = await SignClient.init({
      logger: DEFAULT_LOGGER,
      relayUrl: DEFAULT_RELAY_URL,
      projectId: projectId,
      metadata: metadata || {
        name: "Flow dApp",
        description: "Flow dApp powered by FCL",
        url: "https://flow.com",
        icons: ["https://avatars.githubusercontent.com/u/62387156?v=4"],
      },
      // NOTE: Don't pass storage parameter - let SignClient use default keyvaluestorage
      // which will automatically use the React Native version with AsyncStorage
    })

    console.log("=== WalletConnect SignClient initialized successfully")
    return client
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
  console.log("=== initLazy called with projectId:", config.projectId)

  // Lazy load the client
  //  - Initialize the client if it doesn't exist
  //  - If it does exist, return existing client
  //  - If existing client fails to initialize, reinitialize
  clientPromise = clientPromise
    .catch(() => null)
    .then(_client => {
      if (_client) {
        console.log("=== Reusing existing WalletConnect client")
        return _client
      } else {
        console.log("=== Creating new WalletConnect client")
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

  const FclWcServicePlugin = makeServicePlugin(clientPromise, config)

  return {
    FclWcServicePlugin,
    clientPromise,
  }
}

export const init = async (config: FclWalletConnectConfig) => {
  console.log("=== init called with projectId:", config.projectId)
  const {FclWcServicePlugin, clientPromise} = initLazy(config)
  const client = await clientPromise
  console.log("=== WalletConnect client ready:", !!client)

  return {
    FclWcServicePlugin,
    client,
  }
}

// Returns the SignClient instance used by this plugin if it has been initialized
export async function getClient() {
  return clientPromise.then(client => {
    if (!client) {
      throw new Error("WalletConnect client not initialized")
    }

    return client
  })
}
