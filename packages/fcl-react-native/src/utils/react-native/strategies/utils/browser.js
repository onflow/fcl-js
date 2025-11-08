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
  const parseDeeplink = (result) => {
    console.log('=== parseDeeplink called with:', result)

    // Handle both deep link callback (with url) and browser result (with type)
    const url = result?.url || result?.url
    if (!url) {
      console.log('=== No URL in result, checking if browser was dismissed')
      if (result?.type === 'dismiss' || result?.type === 'cancel') {
        console.log('=== Browser dismissed by user')
        close()
      }
      return
    }

    console.log('=== Parsing URL:', url)
    const {queryParams} = LinkingModule.parse(url)
    console.log('=== Query params:', queryParams)

    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME]
    if (!eventDataRaw) {
      console.log('=== No FCL response in URL, ignoring')
      return
    }

    console.log('=== Event data raw:', eventDataRaw)
    const eventData = JSON.parse(eventDataRaw)
    console.log('=== Event data parsed:', eventData)

    handler({data: eventData})

    // Auto-close browser after successful authentication
    console.log('=== Auto-closing browser after authentication')
    close()
  }

  const [browser, unmount] = await renderBrowser(
    serviceEndpoint(service, config, body)
  )
  // Android deeplink parsing
  LinkingModule.addEventListener("url", parseDeeplink)
  // iOS deeplink parsing
  browser.then(parseDeeplink).catch(error => {
    console.log('=== Browser promise error:', error)
  })
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
