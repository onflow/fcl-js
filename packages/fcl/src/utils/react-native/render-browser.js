import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export function renderBrowser(src, data) {
  const redirectUrl = Linking.createURL("$$fcl_auth_callback$$", {queryParams: {}})
  const url = new URL(src)
  url.searchParams.append("fcl_redirect_url", redirectUrl);
  if (data) {
    url.searchParams.append("fcl_data", JSON.stringify(data));
  }

  const webbrowserPromise = WebBrowser.openAuthSessionAsync(url.href)

  const unmount = () => {
    WebBrowser.dismissAuthSession()
  }

  return [webbrowserPromise, unmount]
}
