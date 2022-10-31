import * as fcl from "@onflow/fcl"
import React, {useEffect} from "react"
import {View} from "react-native"
// import { WebView } from "react-native-webview";
import {ReactDOM, useState} from "react"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {makeServicePlugin} from "./service"
// import { setConfiguredNetwork } from "./utils";
import {WebViewHandler} from "./web-view.js"

const DEFAULT_RELAY_URL = "wss://relay.reactnative.dev"
const DEFAULT_LOGGER = "debug"
let client = null

// let webViewCompSetter = () => {};

// const mountWebView = ({ endpoint = "" } = {}) => {
//   console.log("in mountWebView", webViewCompSetter);
//   webViewCompSetter(<WebView source={{ uri: endpoint }} />);
// };
// const unMountWebView = () => {
//   webViewCompSetter(null);
// };

const useMountWebView = () => {
  const [WebViewComp, setWebViewComp] = useState(null)

  const mountWebView = ({endpoint}) => {
    setWebViewComp(
      <WebViewHandler
        endpoint={endpoint}
        handleClose={() => setWebViewComp(null)}
      ></WebViewHandler>
    )
  }
  const unMountWebView = () => {
    setWebViewComp(null)
  }

  return {
    WebViewComp,
    mountWebView,
    unMountWebView,
  }
}

export const FCLReactNativeProvider = ({children}) => {
  const [fclReactNativeServicePlugin, setFCLReactNativeServicePlugin] =
    useState(null)
  const {WebViewComp, mountWebView, unMountWebView} = useMountWebView()

  useEffect(() => {
    const FclReactNativeServicePlugin = makeServicePlugin({
      wallets: [],
      mountWebView,
      unMountWebView,
    })
    fcl.pluginRegistry.add(FclReactNativeServicePlugin)
    setFCLReactNativeServicePlugin(FclReactNativeServicePlugin)
  }, [])

  return (
    <>
      {WebViewComp}
      {children}
    </>
  )
}

// export const init = ({ wallets = [] } = {}) => {
//   // setConfiguredNetwork();
//   // const FclReactNativeServicePlugin = makeServicePlugin({
//   //   wallets,
//   //   mountWebView,
//   //   unMountWebView,
//   // });
//   // // fcl.discovery.authn.update();

//   return {
//     // FclReactNativeServicePlugin,
//     FCLReactNativeProvider,
//   };
// };
