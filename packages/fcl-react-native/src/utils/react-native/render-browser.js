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
  const webbrowser = WB.openAuthSessionAsync(url.toString())

  const unmount = () => {
    try {
      WB.dismissAuthSession()
    } catch (error) {
      console.log(error)
    }
  }

  // Call onClose when the webbrowser is closed
  webbrowser.then(() => {
    if (opts?.onClose) {
      opts.onClose()
    }
  })

  return [webbrowser, unmount]
}
