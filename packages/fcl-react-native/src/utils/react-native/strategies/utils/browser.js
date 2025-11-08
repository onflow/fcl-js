import {renderBrowser} from "../../render-browser"
import {serviceEndpoint} from "./service-endpoint"
import {FCL_RESPONSE_PARAM_NAME, buildMessageHandler} from "@onflow/fcl-core"

// Lazy load expo-linking to avoid TurboModule errors
let Linking = null
const getLinking = async () => {
  if (!Linking) {
    Linking = await import("expo-linking")
  }
  return Linking
}

const noop = () => {}

export async function browser(service, config, body, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const LinkingModule = await getLinking()

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
    const {queryParams} = LinkingModule.parse(url)
    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME]
    const eventData = JSON.parse(eventDataRaw)

    handler({data: eventData})
  }

  const [browser, unmount] = await renderBrowser(
    serviceEndpoint(service, config, body)
  )
  // Android deeplink parsing
  LinkingModule.addEventListener("url", parseDeeplink)
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
