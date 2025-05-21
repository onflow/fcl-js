export interface BuildMessageHandlerParams {
  close: () => void
  send: (msg: any) => void
  onReady: (
    e: MessageEvent,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  onResponse: (
    e: MessageEvent,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  onMessage: (
    e: MessageEvent,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  onCustomRpc: (
    payload: any,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  getSource?: () => Window | null
}

const CLOSE_EVENT = "FCL:VIEW:CLOSE"
const READY_EVENT = "FCL:VIEW:READY"
const RESPONSE_EVENT = "FCL:VIEW:RESPONSE"
const CUSTOM_RPC = "FCL:VIEW:CUSTOM_RPC"

const _ = (e: string): string => e.toLowerCase()

const IGNORE = new Set([
  "monetizationstart",
  "monetizationpending",
  "monetizationprogress",
  "monetizationstop",
])

const deprecate = (was: string, want: string): void =>
  console.warn(
    "DEPRECATION NOTICE",
    `Received ${was}, please use ${want} for this and future versions of FCL`
  )

export const buildMessageHandler = ({
  close,
  send,
  onReady,
  onResponse,
  onMessage,
  onCustomRpc,
  getSource,
}: BuildMessageHandlerParams): ((e: MessageEvent) => void) => {
  let source: any
  return (e: MessageEvent): void => {
    try {
      source = getSource?.() || source
    } catch (_) {
      // If getSource isn't working correctly, we should reset source
      // to prevent desync between the source and the actual source
      source = null
    }

    try {
      if (typeof e.data !== "object") return
      if (IGNORE.has(e.data.type)) return
      if (source != null && e.source !== source) return
      if (_(e.data.type) === _(CLOSE_EVENT)) close()
      if (_(e.data.type) === _(READY_EVENT)) {
        onReady(e, {send, close})
        source ||= e.source as Window
      }
      if (_(e.data.type) === _(RESPONSE_EVENT)) onResponse(e, {send, close})
      if (_(e.data.type) === _(CUSTOM_RPC))
        onCustomRpc(e.data.payload, {send, close})
      onMessage(e, {send, close})

      // Backwards Compatible
      if (_(e.data.type) === _("FCL:FRAME:READY")) {
        deprecate(e.data.type, READY_EVENT)
        onReady(e, {send, close})
        source ||= e.source as Window
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
        source ||= e.source as Window
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
}
