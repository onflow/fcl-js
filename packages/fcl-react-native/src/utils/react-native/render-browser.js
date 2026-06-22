import {URL} from "@onflow/fcl-core"
import * as WebBrowser from "expo-web-browser"

/**
 *
 * @param {URL} src
 * @param {object} opts
 * @returns {[object, () => void]}
 */
export async function renderBrowser(src, opts = {}) {
  const url = new URL(src.toString())

  const webbrowser = WebBrowser.openAuthSessionAsync(url.toString())

  const unmount = () => {
    try {
      WebBrowser.dismissAuthSession()
    } catch (error) {
      // Ignore errors on dismissal
    }
  }

  // Call onClose when the webbrowser is closed
  webbrowser
    .then(result => {
      if (opts?.onClose) {
        opts.onClose()
      }
    })
    .catch(error => {
      // Ignore errors
    })

  return [webbrowser, unmount]
}
