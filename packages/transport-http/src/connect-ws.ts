import {safeParseJSON} from "./utils"
import {PubSub, DataStream} from "@onflow/util-pubsub"

// TODO: Implement retries
export function connectWs<T>({
  hostname,
  path,
  params,
  retryLimit = 5,
  retryIntervalMs = 1000,
}: {
  hostname: string
  path: string
  params?: Record<string, string>
  retryLimit?: number
  retryIntervalMs?: number
}): DataStream<T> {
  // Build a data stream
  const pubSub = new PubSub<T>()
  const dataStream = new DataStream(pubSub, closeConnection)
  function closeConnection() {
    ws.close()
  }

  // Build a websocket connection with correct protocol & params
  const url = buildConnectionUrl(hostname, path, params)
  const ws = new WebSocket(url)

  ws.onmessage = function (e) {
    const data = safeParseJSON(e.data)
    if (data) {
      pubSub.next(data)
    }
  }

  ws.onclose = function () {
    pubSub.complete()
  }

  ws.onerror = function (e) {
    pubSub.error(e)
  }

  return dataStream
}

function buildConnectionUrl(
  hostname: string,
  path: string,
  params?: Record<string, string>
) {
  const url = new URL(path, hostname)
  if (url.protocol === "https:") {
    url.protocol = "wss:"
  } else if (url.protocol === "http:") {
    url.protocol = "ws:"
  }

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value)
    }
  })

  return url.toString()
}
