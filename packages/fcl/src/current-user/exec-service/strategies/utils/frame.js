import {renderFrame} from "./render-frame"
import {serviceEndpoint} from "./service-endpoint"

const CLOSE_EVENT = "FCL:VIEW:CLOSE"
const READY_EVENT = "FCL:VIEW:READY"
const RESPONSE_EVENT = "FCL:VIEW:RESPONSE"

export const _ = e => typeof e === "string" && e.toLowerCase()

const IGNORE = new Set([
  "monetizationstart",
  "monetizationpending",
  "monetizationprogress",
  "monetizationstop",
])

const noop = () => {}

export function frame(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  var tab = null
  const onClose = opts.onClose || noop
  const onMessage = opts.onMessage || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  window.addEventListener("message", internal)
  const [$frame, unmount] = renderFrame(serviceEndpoint(service))
  return {send, close}

  function internal(e) {
    try {
      if (typeof e.data !== "object") return
      if (IGNORE.has(e.data.type)) return
      if (_(e.data.type) === _(CLOSE_EVENT)) close()
      if (_(e.data.type) === _(READY_EVENT)) onReady(e, {send, close})
      if (_(e.data.type) === _(RESPONSE_EVENT)) onResponse(e, {send, close})
      onMessage(e, {send, close})

      // Backwards Compatible
      if (_(e.data.type) === _("FCL:FRAME:READY")) onReady(e, {send, close})
      if (_(e.data.type) === _("FCL:FRAME:RESPONSE"))
        onResponse(e, {send, close})
      if (_(e.data.type) === _("FCL:FRAME:CLOSE")) close()
      //
      if (_(e.data.type) === _("FCL::CHALLENGE::RESPONSE")) {
        onResponse(e, {send, close})
      }
      if (_(e.data.type) === _("FCL::AUTHZ_READY")) onReady(e, {send, close})
      if (_(e.data.type) === _("FCL::CHALLENGE::CANCEL")) close()
      if (_(e.data.type) === _("FCL::CANCEL")) close()
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
      $frame.contentWindow.postMessage(
        JSON.parse(JSON.stringify(msg || {})),
        "*"
      )
    } catch (error) {
      console.error("Frame Send Error", msg, error)
    }
  }
}
