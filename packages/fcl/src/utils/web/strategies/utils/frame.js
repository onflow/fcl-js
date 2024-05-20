import {renderFrame} from "../../render-frame"
import {buildMessageHandler, serviceEndpoint} from "@onflow/fcl-core"

const noop = () => {}

export function frame(service, opts = {}) {
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

  const [$frame, unmount] = renderFrame(serviceEndpoint(service))
  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", handler)
      unmount()
      onClose()
    } catch (error) {
      console.error("Frame Close Error", error)
    }
  }

  function send(msg) {
    try {
      $frame.postMessage(JSON.parse(JSON.stringify(msg || {})), "*")
    } catch (error) {
      console.error("Frame Send Error", msg, error)
    }
  }
}
