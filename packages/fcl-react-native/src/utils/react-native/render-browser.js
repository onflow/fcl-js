import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"
import {FCL_REDIRECT_URL_PARAM_NAME, URL} from "@onflow/fcl-core"

/**
 *
 * @param {URL} src
 * @param {object} opts
 * @returns {[object, () => void]}
 */
export function renderBrowser(src, opts = {}) {
  const redirectUrl = Linking.createURL("$$fcl_auth_callback$$", {
    queryParams: {},
  })
  const url = new URL(src.toString())
  url.searchParams.append(FCL_REDIRECT_URL_PARAM_NAME, redirectUrl)
  const webbrowser = WebBrowser.openAuthSessionAsync(url.toString())

  const unmount = () => {
    try {
      WebBrowser.dismissAuthSession()
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
