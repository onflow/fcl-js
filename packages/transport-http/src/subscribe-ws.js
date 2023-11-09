import {safeParseJSON} from "./utils"

// TODO: Implement retries
export function subscribeWs({
  hostname,
  path,
  params,
  onData,
  onClose,
  onError,
  retryLimit = 5,
  retryIntervalMs = 1000,
}) {
  const url = new URL(path, hostname)
  url.search = new URLSearchParams(params)
  var ws = new WebSocket(url)

  ws.onmessage = function (e) {
    const data = safeParseJSON(e.data)
    if (data) {
      onData(data)
    }
  }

  ws.onclose = function (e) {
    onClose(e)
  }

  ws.onerror = function (err) {
    onError(err)
  }

  return () => {
    ws.close()
  }
}
