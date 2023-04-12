import * as WebBrowser from 'expo-web-browser';

export function renderBrowser(src) {
  const webbrowser = WebBrowser.openAuthSessionAsync(src.toString());

  const unmount = () => {
    WebBrowser.dismissAuthSession()
  }

  return [webbrowser, unmount]
}
