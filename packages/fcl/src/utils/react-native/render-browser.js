import * as WebBrowser from "expo-web-browser"
import * as Linking from 'expo-linking'
import { FCL_REDIRECT_URL_PARAM_NAME } from "../constants"

/**
 * 
 * @param {URL} src 
 * @param {object} opts 
 * @returns {[object, () => void]}
 */
export function renderBrowser(src, opts = {}) {
  const redirectUrl = Linking.createURL("$$fcl_auth_callback$$", {queryParams: {}})
  src.searchParams.append(FCL_REDIRECT_URL_PARAM_NAME, redirectUrl)
  const webbrowser = WebBrowser.openAuthSessionAsync(src.toString())

  const unmount = () => {
    try {
      WebBrowser.dismissAuthSession()
    } catch (error) {
      console.log(error)
    }
  }

  return [webbrowser, unmount]
}
