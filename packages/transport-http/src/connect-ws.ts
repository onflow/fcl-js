import {EventEmitter} from "events"
import {safeParseJSON} from "./utils"
import {StreamConnection} from "@onflow/typedefs"
import {WebSocket} from "./websocket"

type WebSocketConnection<T> = StreamConnection<{
  data: T
}>

export function connectWs<T>({
  hostname,
  path,
  params,
}: {
  hostname: string
  path: string
  params?: Record<string, string>
}): WebSocketConnection<T> {
  // Build a websocket connection with correct protocol & params
  const url = buildConnectionUrl(hostname, path, params)
  const ws = new WebSocket(url)
  const emitter = new EventEmitter()

  ws.onmessage = function (e) {
    const data = safeParseJSON(e.data)
    if (data) {
      emitter.emit("data", data)
    } else {
      emitter.emit(
        "error",
        new Error("connectWs: invalid JSON data: " + e.data)
      )
      this.close()
    }
  }

  ws.onopen = function () {
    emitter.emit("open")
  }

  ws.onclose = function () {
    emitter.emit("close")
    emitter.removeAllListeners()
  }

  ws.onerror = function (e) {
    emitter.emit("error", e)
  }

  return {
    on(event: "data" | "close" | "error" | "open", listener: any) {
      emitter.on(event, listener)
      return this
    },
    off(event: "data" | "close" | "error" | "open", listener: any) {
      emitter.off(event, listener)
      return this
    },
    close() {
      ws.close()
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
