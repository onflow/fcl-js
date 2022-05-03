const CLOSE_EVENT = "FCL:VIEW:CLOSE"
const READY_EVENT = "FCL:VIEW:READY"
const RESPONSE_EVENT = "FCL:VIEW:RESPONSE"

const _ = e => typeof e === "string" && e.toLowerCase()

const IGNORE = new Set([
  "monetizationstart",
  "monetizationpending",
  "monetizationprogress",
  "monetizationstop",
])

const deprecate = (was, want) =>
  console.warn(
    "DEPRECATION NOTICE",
    `Received ${was}, please use ${want} for this and future versions of FCL`
  )

export const buildMessageHandler =
  ({close, send, onReady, onResponse, onMessage}) =>
  e => {
    try {
      if (typeof e.data !== "object") return
      if (IGNORE.has(e.data.type)) return
      if (_(e.data.type) === _(CLOSE_EVENT)) close()
      if (_(e.data.type) === _(READY_EVENT)) onReady(e, {send, close})
      if (_(e.data.type) === _(RESPONSE_EVENT)) onResponse(e, {send, close})
      onMessage(e, {send, close})

      // Backwards Compatible
      if (_(e.data.type) === _("FCL:FRAME:READY")) {
        deprecate(e.data.type, READY_EVENT)
        onReady(e, {send, close})
      }
      if (_(e.data.type) === _("FCL:FRAME:RESPONSE")) {
        deprecate(e.data.type, RESPONSE_EVENT)
        onResponse(e, {send, close})
      }
      if (_(e.data.type) === _("FCL:FRAME:CLOSE")) {
        deprecate(e.data.type, CLOSE_EVENT)
        close()
      }
      //
      if (_(e.data.type) === _("FCL::CHALLENGE::RESPONSE")) {
        deprecate(e.data.type, RESPONSE_EVENT)
        onResponse(e, {send, close})
      }
      if (_(e.data.type) === _("FCL::AUTHZ_READY")) {
        deprecate(e.data.type, READY_EVENT)
        onReady(e, {send, close})
      }
      if (_(e.data.type) === _("FCL::CHALLENGE::CANCEL")) {
        deprecate(e.data.type, CLOSE_EVENT)
        close()
      }
      if (_(e.data.type) === _("FCL::CANCEL")) {
        deprecate(e.data.type, CLOSE_EVENT)
        close()
      }
    } catch (error) {
      console.error("Frame Callback Error", error)
      close()
    }
  }
