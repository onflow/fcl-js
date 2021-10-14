import {renderTab} from "./render-tab"
import {serviceEndpoint} from "./service-endpoint"
import {buildMessageHandler} from "./buildMessageHandler"

const noop = () => {}

export function tab(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  var tab = null
  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  window.addEventListener(
    "message",
    buildMessageHandler({close, send, onReady, onResponse, onMessage})
  )
  const [$tab, unmount] = renderTab(serviceEndpoint(service))
  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", buildMessageHandler)
      if (tab != null) tab.close()
      unmount()
      onClose()
    } catch (error) {
      console.error("Tab Close Error", error)
    }
  }

  function send(msg) {
    try {
      $tab.postMessage(JSON.parse(JSON.stringify(msg || {})), "*")
    } catch (error) {
      console.error("Tab Send Error", msg, error)
    }
  }
}
