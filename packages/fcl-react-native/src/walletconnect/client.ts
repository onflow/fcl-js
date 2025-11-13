import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {CoreTypes} from "@walletconnect/types"
import {SignClient} from "@walletconnect/sign-client"
import {makeServicePlugin} from "./service"

// NOTE: SignClient is now imported at the top to avoid Expo async require issues
// The crypto polyfill (react-native-get-random-values) must still be loaded first from config/flow.ts

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
    console.log("WalletConnect initClient: Starting initialization, project ID:", projectId.substring(0, 8) + "...")

    // Initialize WalletConnect compat first
    console.log("WalletConnect initClient: Initializing compat layer...")
    await initializeWalletConnect()
    console.log("WalletConnect initClient: Compat layer ready")

    // SignClient will automatically use @walletconnect/keyvaluestorage
    // which has a React Native version that uses AsyncStorage internally
    console.log("WalletConnect initClient: Creating SignClient...")
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
    console.log("WalletConnect initClient: SignClient created successfully")

    // Set up session event listeners
    client.on("session_delete", async ({topic}: {topic: string}) => {
      console.log("WalletConnect: Session deleted by wallet - Topic:", topic.substring(0, 10) + "...")
      // Auto-logout when wallet disconnects
      try {
        const {default: fcl} = await import("@onflow/fcl")
        const user = await fcl.currentUser.snapshot()

        // Check if the deleted session matches the current user's session
        const hasWcService = user.services?.some((s: any) =>
          s.method === "WC/RPC" && s.params?.sessionTopic === topic
        )

        if (user.loggedIn && hasWcService) {
          console.log("WalletConnect: Auto-logging out user due to wallet disconnect")
          await fcl.unauthenticate()
        }
      } catch (error) {
        console.log("WalletConnect: Error during auto-logout:", error)
      }
    })

    client.on("session_expire", async ({topic}: {topic: string}) => {
      console.log("WalletConnect: Session expired - Topic:", topic.substring(0, 10) + "...")
      // Auto-logout when session expires
      try {
        const {default: fcl} = await import("@onflow/fcl")
        const user = await fcl.currentUser.snapshot()

        const hasWcService = user.services?.some((s: any) =>
          s.method === "WC/RPC" && s.params?.sessionTopic === topic
        )

        if (user.loggedIn && hasWcService) {
          console.log("WalletConnect: Auto-logging out user due to session expiry")
          await fcl.unauthenticate()
        }
      } catch (error) {
        console.log("WalletConnect: Error during auto-logout:", error)
      }
    })

    client.on("session_update", () => {
      console.log("WalletConnect: Session updated")
      // Session was updated (e.g., account changed)
    })

    client.on("session_request", () => {
      // This handler exists to prevent "emitting without listeners" errors
      // Actual request handling is done through client.request() calls
    })

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
  // Lazy load the client
  //  - Initialize the client if it doesn't exist
  //  - If it does exist, return existing client
  //  - If existing client fails to initialize, reinitialize
  console.log("WalletConnect initLazy: Called")

  clientPromise = clientPromise
    .catch(() => {
      console.log("WalletConnect initLazy: Promise catch triggered")
      return null
    })
    .then(_client => {
      console.log("WalletConnect initLazy: Promise then - client exists:", _client !== null)
      if (_client) {
        console.log("WalletConnect initLazy: Reusing existing client")
        return _client
      } else {
        console.log("WalletConnect initLazy: Calling initClient")
        return initClient({
          projectId: config.projectId,
          metadata: config.metadata,
        })
      }
    })
    .catch(e => {
      console.log("WalletConnect initLazy: Error caught:", e.message || e)
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
  const {FclWcServicePlugin, clientPromise} = initLazy(config)
  const client = await clientPromise

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
