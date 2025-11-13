import {FCL_REDIRECT_URL_PARAM_NAME, URL} from "@onflow/fcl-core"

// Lazy load Expo modules to avoid TurboModule errors in Expo Go
// These modules require native code and must be loaded after React Native initializes
let WebBrowser = null
let Linking = null

const getExpoModules = async () => {
  if (!WebBrowser || !Linking) {
    WebBrowser = await import("expo-web-browser")
    Linking = await import("expo-linking")
  }
  return {WebBrowser, Linking}
}

/**
 *
 * @param {URL} src
 * @param {object} opts
 * @returns {[object, () => void]}
 */
export async function renderBrowser(src, opts = {}) {
  const {WebBrowser: WB, Linking: L} = await getExpoModules()

  const redirectUrl = L.createURL("$$fcl_auth_callback$$", {
    queryParams: {},
  })

  const url = new URL(src.toString())
  url.searchParams.append(FCL_REDIRECT_URL_PARAM_NAME, redirectUrl)

  console.log("Opening Browser Auth Session - URL:", url.toString())

  const webbrowser = WB.openAuthSessionAsync(url.toString())

  const unmount = () => {
    try {
      WB.dismissAuthSession()
      console.log("Browser Auth Session Dismissed - Auth session closed successfully")
    } catch (error) {
      // Ignore errors on dismissal
      console.log("Browser Auth Session Dismissal Error:", error.message || error)
    }
  }

  // Call onClose when the webbrowser is closed
  webbrowser
    .then(result => {
      console.log("Browser Auth Session Completed - Result type:", result.type)
      if (opts?.onClose) {
        opts.onClose()
      }
    })
    .catch(error => {
      console.log("Browser Auth Session Error:", error.message || error)
    })

  return [webbrowser, unmount]
}
