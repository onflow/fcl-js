import {invariant} from "@onflow/util-invariant"
import {CoreTypes} from "@walletconnect/types"
import {SignClient} from "@walletconnect/sign-client"
import * as Linking from "expo-linking"

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "error" // Use "error" for production, "debug" for development

let walletConnectInitialized = false

/**
 * Initialize WalletConnect React Native compatibility layer.
 * This must be called before creating the SignClient.
 */
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
 * Initialize a SignClient instance for React Native.
 * Handles crypto polyfills, compat modules, and metadata with redirect URIs.
 */
export async function initializeSignClient(opts: {
  projectId: string
  metadata?: CoreTypes.Metadata
}): Promise<InstanceType<typeof SignClient>> {
  const {projectId, metadata} = opts

  invariant(
    projectId != null,
    "FCL Wallet Connect Error: WalletConnect projectId is required"
  )

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
}
