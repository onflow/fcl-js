import {buildMessageHandler} from "./buildMessageHandler"
const noop = () => {}

export async function extension(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}
  const {endpoint: ext} = service

  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  function close() {
    try {
      window.removeEventListener("message", buildMessageHandler)
      onClose()
    } catch (error) {
      console.error("Extension Close Error", error)
    }
  }

  function send(msg) {
    try {
      window[ext].onflow.send(JSON.parse(JSON.stringify(msg || {})))
    } catch (error) {
      console.error("Extension Send Error", msg, error)
    }
  }

  window.addEventListener(
    "message",
    buildMessageHandler({close, send, onReady, onResponse, onMessage})
  )
  await window[ext]?.onflow.enable()
  return {send, close}
}
