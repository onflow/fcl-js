import { createSignal } from "@react-rxjs/utils"
import { createElement } from 'react'
import { WebView } from "react-native-webview";

import { buildMessageHandler } from "./buildMessageHandler"
import { webViewRef, useEndpoint, renderWebview } from "./render-webview";
import { serviceEndpoint } from "./service-endpoint"

const [messageChange$, setMessage] = createSignal();
const [onLoad$, setOnLoad] = createSignal();

const noop = () => {}

export function webview(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  const handler = buildMessageHandler({
    close,
    send,
    onReady,
    onResponse,
    onMessage,
  })

  const messageSubscription = messageChange$.subscribe(handler)
  const onLoadSubscription = onLoad$.subscribe(() => onReady(null, {send, close}))

  const [_, unmount] = renderWebview(serviceEndpoint(service))
  return {send, close}

  function send (msg) {
    webViewRef.current.injectJavaScript(`
      window.postMessage(
        ${JSON.stringify(msg || {})}
      , "*");
      true;
    `);
  };

  function close() {
    try {
      webViewRef.current.injectJavaScript(`
        window.removeEventListener("message", (event) => window.ReactNativeWebView.postMessage(event));
        true;
      `)
      unmount()
      messageSubscription.unsubscribe();
      onLoadSubscription.unsubscribe();
      onClose()
    } catch (error) {
      console.error("WebView Close Error", error)
    }
  }

}

const parseData = (rawData) => {
  try {
    const data = JSON.parse(rawData)
    return data
  } catch (error) {
    console.error('Error parsing rawData', error, rawData)
    return
  } 
}

export const FCLWebView = () => {
  const endpoint = useEndpoint()

  if (!endpoint) {
    return null
  }

  return createElement(WebView, {ref: webViewRef,
    source: { uri: String(endpoint) },
    onMessage: ({nativeEvent}) => {
      const data = parseData(nativeEvent.data)
      const e = { data }
      return setMessage(e)
    },
    javaScriptEnabled: true,
    injectedJavaScriptBeforeContentLoaded: `
      window.addEventListener("message", (event) => window.ReactNativeWebView.postMessage(JSON.stringify(event.data)));
      true;
    `,
    onLoad: () => {
      setOnLoad(true)
    }
  })
};
