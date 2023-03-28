import './config'
import * as fcl from "@onflow/fcl"
import {useEffect, useState, createElement, Fragment} from "react"
import {makeServicePlugin} from "./service"
import {WebViewHandler} from "./web-view"

const useMountWebView = () => {
  const [props, setProps] = useState(null)
  const showWebviewComponent = !!props
  const unMountWebView = () => {
    setProps(null)
  }
  const mountWebView = (props) => {
    setProps(props)
  }
  const WebViewComp = createElement(WebViewHandler, { ...props, onClose: unMountWebView })
  return {
    WebViewComp,
    showWebviewComponent,
    mountWebView,
    unMountWebView,
  }
}

export const FCLReactNativeProvider = ({children}) => {
  const {WebViewComp, mountWebView, unMountWebView, showWebviewComponent} = useMountWebView()

  useEffect(() => {
    const FclReactNativeServicePlugin = makeServicePlugin({
      wallets: [],
      mountWebView,
      unMountWebView,
    })
    fcl.pluginRegistry.add(FclReactNativeServicePlugin)
  }, [])

  const childrenArray = [
    showWebviewComponent ? WebViewComp : null,
    children
  ].filter(Boolean);

  return createElement(Fragment, null, ...childrenArray)
}
