import * as WebBrowser from "expo-web-browser"

export function renderBrowser(src, opts = {}) {
  const webbrowser = WebBrowser.openAuthSessionAsync(src.toString())

  const unmount = () => {
    try {
      WebBrowser.dismissAuthSession()
    } catch (error) {
      console.log(error)
    }
  }

  // Call onClose when the webbrowser is closed
  webbrowser.then(() => {
    opts?.onClose()
  })

  return [webbrowser, unmount]
}
