import {renderBrowser} from "../../render-browser"
import {serviceEndpoint} from "./service-endpoint"
import {FCL_RESPONSE_PARAM_NAME, buildMessageHandler} from "@onflow/fcl-core"
import * as Linking from "expo-linking"

const noop = () => {}

export async function browser(service, config, body, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const onClose = opts.onClose || noop
  const onMessage = noop
  const onReady = noop
  const onResponse = opts.onResponse || noop

  const handler = buildMessageHandler({
    close,
    send: noop,
    onReady,
    onResponse,
    onMessage,
  })
  const parseDeeplink = result => {
    // Handle both deep link callback (with url) and browser result (with type)
    const url = result?.url || result?.url
    if (!url) {
      if (result?.type === "dismiss" || result?.type === "cancel") {
        close()
      }
      return
    }

    const {queryParams} = Linking.parse(url)

    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME]
    if (!eventDataRaw) {
      return
    }

    try {
      const eventData = JSON.parse(eventDataRaw)

      handler({data: eventData})

      // Auto-close browser after successful authentication
      close()
    } catch (error) {
      // Ignore parse errors
    }
  }

  const [browser, unmount] = await renderBrowser(
    serviceEndpoint(service, config, body)
  )
  // Android deeplink parsing
  Linking.addEventListener("url", parseDeeplink)
  // iOS deeplink parsing
  browser.then(parseDeeplink).catch(() => {
    // Ignore errors
  })
  return {send: noop, close}

  function close() {
    try {
      unmount()
      onClose()
    } catch (error) {
      // Ignore close errors
    }
  }
}
