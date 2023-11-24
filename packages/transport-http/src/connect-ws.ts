import {EventEmitter} from "events"
import {safeParseJSON} from "./utils"
import {StreamConnection} from "@onflow/typedefs"
import {WebSocket} from "./websocket"

export class WebsocketError extends Error {
  code?: number
  reason?: string
  wasClean?: boolean

  constructor({
    code,
    reason,
    message,
    wasClean,
  }: {
    code?: number
    reason?: string
    message?: string
    wasClean?: boolean
  }) {
    const msg = `
      connectWs: connection closed with error${message ? `: ${message}` : ""}
      ${code ? `code: ${code}` : ""}
      ${reason ? `reason: ${reason}` : ""}
      ${wasClean ? `wasClean: ${wasClean}` : ""}
    `
    super(msg)
    this.name = "WebsocketError"
    this.code = code
    this.reason = reason
    this.wasClean = false
  }
}

type WebSocketConnection<T> = StreamConnection<{
  data: T
}>

export function connectWs<T>({
  hostname,
  path,
  params,
  getParams,
  retryLimit = 5,
  retryIntervalMs = 1000,
}: {
  hostname: string
  path: string
  params?: Record<string, string>
  getParams?: () => Record<string, string> | undefined
  retryLimit?: number
  retryIntervalMs?: number
}): WebSocketConnection<T> {
  if (getParams && params) {
    throw new Error("connectWs: cannot specify both params and getParams")
  }
  let outputEmitter = new EventEmitter()

  let retryCount = 0
  const resolveParams = getParams || (() => params)
  let close = () => {}

  ;(function connect() {
    let userClosed = false
    let hasOpened = false

    // Build a websocket connection with correct protocol & params
    const url = buildConnectionUrl(hostname, path, resolveParams())
    const ws = new WebSocket(url)

    ws.onmessage = function (e) {
      const data = safeParseJSON(e.data)
      if (data) {
        outputEmitter.emit("data", data)
      } else {
        outputEmitter.emit(
          "error",
          new WebsocketError({message: "invalid JSON data"})
        )
        this.close()
      }
    }

    ws.onclose = function (e) {
      if (userClosed) {
        outputEmitter.emit("close")
        outputEmitter.removeAllListeners()
        return
      }

      if (!hasOpened) {
        if (retryCount < retryLimit) {
          retryCount++
          setTimeout(connect, retryIntervalMs)
        } else {
          outputEmitter.emit(
            "error",
            new WebsocketError({
              wasClean: e.wasClean,
              code: e.code,
              reason: e.reason,
              message: "failed to connect",
            })
          )

          // Emit close event on next tick so that the error event is emitted first
          setTimeout(() => {
            outputEmitter.emit("close")
            outputEmitter.removeAllListeners()
          })
        }
      } else {
        // If the connection was established before closing, attempt to reconnect
        setTimeout(connect, retryIntervalMs)
      }
    }

    ws.onopen = function () {
      hasOpened = true
      retryCount = 0
    }

    close = () => {
      userClosed = true
      ws.close()
    }
  })()

  return {
    on(event: "data" | "close" | "error", listener: any) {
      outputEmitter.on(event, listener)
      return this
    },
    off(event: "data" | "close" | "error", listener: any) {
      outputEmitter.off(event, listener)
      return this
    },
    close() {
      close()
    },
  }
}

export function buildConnectionUrl(
  hostname: string,
  path?: string,
  params?: Record<
    string,
    string | number | string[] | number[] | null | undefined
  >
) {
  const url = new URL(path || "", hostname)
  if (url.protocol === "https:") {
    url.protocol = "wss:"
  } else if (url.protocol === "http:") {
    url.protocol = "ws:"
  }

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) {
      let formattedValue: string
      if (Array.isArray(value)) {
        formattedValue = value.join(",")
      } else {
        formattedValue = value.toString()
      }
      url.searchParams.append(key, formattedValue)
    }
  })

  return url.toString()
}
