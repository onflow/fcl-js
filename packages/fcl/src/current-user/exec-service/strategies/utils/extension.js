const CLOSE_EVENT = "FCL:VIEW:CLOSE"
const READY_EVENT = "FCL:VIEW:READY"
const RESPONSE_EVENT = "FCL:VIEW:RESPONSE"

const noop = () => {}
const _ = e => typeof e === "string" && e.toLowerCase()

const IGNORE = new Set([
  "monetizationstart",
  "monetizationpending",
  "monetizationprogress",
  "monetizationstop",
])

const buildInternal =
  ({close, send, onReady, onResponse}) =>
  e => {
    try {
      if (typeof e.data !== "object") return
      if (IGNORE.has(e.data.type)) return
      if (_(e.data.type) === _(CLOSE_EVENT)) close()
      if (_(e.data.type) === _(READY_EVENT)) onReady(e, {send, close})
      if (_(e.data.type) === _(RESPONSE_EVENT)) onResponse(e, {send, close})
    } catch (error) {
      console.error("Ext Callback Error", error)
      close()
    }
  }

export async function extension(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}
  const {endpoint: ext} = service

  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  await window[ext].onflow.enable()
  window.addEventListener(
    "message",
    buildInternal({close, send, onReady, onResponse, onMessage})
  )
  return {send, close}

  function close() {
    try {
      window.removeEventListener("message", buildInternal)
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
}
