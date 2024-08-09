import {buildMessageHandler} from "@onflow/fcl-core"

const noop = () => {}

export function extension(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop
  const onCustomRpc = opts.onCustomRpc || noop

  const handler = buildMessageHandler({
    close,
    send,
    onReady,
    onResponse,
    onMessage,
    onCustomRpc,
  })
  window.addEventListener("message", handler)

  send({service})

  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", handler)
      onClose()
    } catch (error) {
      console.error("Ext Close Error", error)
    }
  }

  function send(msg) {
    try {
      window && window.postMessage(JSON.parse(JSON.stringify(msg || {})), "*")
    } catch (error) {
      console.error("Ext Send Error", msg, error)
    }
  }
}
