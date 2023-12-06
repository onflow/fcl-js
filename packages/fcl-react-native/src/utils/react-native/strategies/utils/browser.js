import * as Linking from "expo-linking"
import {renderBrowser} from "../../render-browser"
import {serviceEndpoint} from "./service-endpoint"
import {FCL_RESPONSE_PARAM_NAME, buildMessageHandler} from "@onflow/fcl-core"

const noop = () => {}

export function browser(service, config, body, opts = {}) {
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
  const parseDeeplink = ({url}) => {
    const {queryParams} = Linking.parse(url)
    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME]
    const eventData = JSON.parse(eventDataRaw)

    handler({data: eventData})
  }

  const [browser, unmount] = renderBrowser(
    serviceEndpoint(service, config, body)
  )
  // Android deeplink parsing
  Linking.addEventListener("url", parseDeeplink)
  // iOS deeplink parsing
  browser.then(parseDeeplink)
  return {send: noop, close}

  function close() {
    try {
      unmount()
      onClose()
    } catch (error) {
      console.error("Frame Close Error", error)
    }
  }
}
