import * as WebBrowser from "expo-web-browser"

export function renderBrowser(src, opts = {}) {
  const webbrowser = WebBrowser.openAuthSessionAsync(src.toString())

  const unmount = () => {
    WebBrowser.dismissAuthSession()
  }

  // Call onClose when the webbrowser is closed
  webbrowser.then(() => {
    opts?.onClose()
  })

  return [webbrowser, unmount]
}
