import {renderTab} from "./render-tab"
import {serviceEndpoint} from "./service-endpoint"
import {buildMessageHandler} from "./buildMessageHandler"

const noop = () => {}

export function tab(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  window.addEventListener(
    "message",
    buildMessageHandler({close, send, onReady, onResponse, onMessage})
  )
  const [$tab, unmount] = renderTab(serviceEndpoint(service))
  const timer = setInterval(function () {
    if ($tab && $tab.closed) {
      close()
    }
  }, 500)

  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", buildMessageHandler)
      clearInterval(timer)
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
