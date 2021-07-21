import {renderPop} from "./render-pop"
import {serviceEndpoint} from "./service-endpoint"

const CLOSE_EVENT = "FCL:FRAME:CLOSE"
const READY_EVENT = "FCL:FRAME:READY"
const RESPONSE_EVENT = "FCL:FRAME:RESPONSE"

const noop = () => {}

const IGNORE = new Set([
  "monetizationstart",
  "monetizationpending",
  "monetizationprogress",
  "monetizationstop",
])

export function pop(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  var tab = null
  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  window.addEventListener("message", internal)

  const [$pop, unmount] = renderPop(serviceEndpoint(service))
  return {send, close}

  function internal(e) {
    try {
      if (typeof e.data !== "object") return
      if (IGNORE.has(e.data.type)) return
      if (e.data.type === CLOSE_EVENT) close()
      if (e.data.type === READY_EVENT) onReady(e, {send, close})
      if (e.data.type === RESPONSE_EVENT) onResponse(e, {send, close})
      onMessage(e, {send, close})

      // Backwards Compatible
      if (e.data.type === "FCL::CHALLENGE::RESPONSE") {
        onResponse(e, {send, close})
      }
      if (e.data.type === "FCL::AUTHZ_READY") onReady(e, {send, close})
      if (e.data.type === "FCL::CHALLENGE::CANCEL") close()
      if (e.data.type === "FCL::CANCEL") close()
    } catch (error) {
      console.error("Frame Callback Error", error)
      close()
    }
  }

  function close() {
    try {
      window.removeEventListener("message", internal)
      if (tab != null) tab.close()
      unmount()
      onClose()
    } catch (error) {
      console.error("Frame Close Error", error)
    }
  }

  function send(msg) {
    try {
      $pop.postMessage(JSON.parse(JSON.stringify(msg || {})), "*")
    } catch (error) {
      console.error("Frame Send Error", msg, error)
    }
  }
}
