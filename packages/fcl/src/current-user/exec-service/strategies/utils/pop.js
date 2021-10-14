import {renderPop} from "./render-pop"
import {serviceEndpoint} from "./service-endpoint"
import {buildMessageHandler} from "./buildMessageHandler"

const noop = () => {}

export function pop(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  window.addEventListener(
    "message",
    buildMessageHandler({close, send, onReady, onResponse, onMessage})
  )
  const [$pop, unmount] = renderPop(serviceEndpoint(service))
  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", buildMessageHandler)
      unmount()
      onClose()
    } catch (error) {
      console.error("Popup Close Error", error)
    }
  }

  function send(msg) {
    try {
      $pop.postMessage(JSON.parse(JSON.stringify(msg || {})), "*")
    } catch (error) {
      console.error("Popup Send Error", msg, error)
    }
  }
}
