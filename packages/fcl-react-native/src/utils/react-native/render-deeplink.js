import {AppState} from "react-native"
import {URL} from "@onflow/fcl-core"

// Lazy load expo-linking to avoid TurboModule errors
let Linking = null
const getLinking = async () => {
  if (!Linking) {
    Linking = await import("expo-linking")
  }
  return Linking
}

/**
 * Renders a deeplink view (i.e. deep links to a wallet app)
 *
 * @param {URL} src
 * @param {object} opts
 * @param {() => void} [opts.onClose]
 * @returns {[null, () => void]}
 */
export async function renderDeeplink(src, opts = {}) {
  const LinkingModule = await getLinking()
  const url = new URL(src.toString())

  // Custom schemes (i.e mywallet://) are not supported for
  // security reasons. These schemes can be hijacked by malicious
  // apps and impersonate the wallet.
  //
  // Wallet developers should register a universal link instead.
  // (i.e https://mywallet.com/ or https://link.mywallet.com/)
  //
  // Additionally this allows the wallet to redirect to the app
  // store/show custom web content if the wallet is not installed.
  // In production, enforce HTTPS for security
  const isDev = process.env.NODE_ENV !== "production"
  if (!isDev && url.protocol !== "https:") {
    throw new Error(
      "Deeplink must be https scheme.  Custom schemes are not supported, please use a universal link/app link instead."
    )
  }

  console.log("Opening Deeplink - URL:", url.toString())

  // Link to the target url
  try {
    await LinkingModule.openURL(url.toString())
    console.log("Deeplink Opened Successfully - URL:", url.toString())
  } catch (error) {
    console.log(
      "Deeplink Error - Failed to open URL:",
      url.toString(),
      "Error:",
      error.message || error
    )
    throw error
  }

  const onClose = opts.onClose || (() => {})

  let subscription
  const onAppStateChange = state => {
    if (state === "active") {
      unmount()
      onClose()
    }
  }

  // Use new AppState API (React Native 0.65+)
  subscription = AppState.addEventListener("change", onAppStateChange)

  const unmount = () => {
    subscription?.remove()
  }

  return [null, unmount]
}
