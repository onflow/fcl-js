import {renderPop} from "../../render-pop"
import {buildMessageHandler, serviceEndpoint} from "@onflow/fcl-core"

const noop = () => {}

export function pop(service, opts = {}) {
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
  window.addEventListener("message", handler)

  const [$pop, unmount] = renderPop(serviceEndpoint(service))

  const timer = setInterval(function () {
    if ($pop && $pop.closed) {
      close()
    }
  }, 500)

  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", handler)
      clearInterval(timer)
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
