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
  const parseDeeplink = result => {
    console.log(
      "Browser Deeplink Callback - Result type:",
      result?.type || "unknown"
    )

    // Handle both deep link callback (with url) and browser result (with type)
    const url = result?.url || result?.url
    if (!url) {
      if (result?.type === "dismiss" || result?.type === "cancel") {
        console.log(
          "Browser Dismissed by User - User closed browser without completing authentication"
        )
        close()
      }
      return
    }

    console.log("Parsing Browser Callback URL - URL received:", url)

    const {queryParams} = LinkingModule.parse(url)

    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME]
    if (!eventDataRaw) {
      console.log(
        "No FCL Response in URL - URL does not contain FCL response parameter, ignoring"
      )
      return
    }

    try {
      const eventData = JSON.parse(eventDataRaw)

      console.log(
        "Browser Callback Parsed - Event type:",
        eventData?.type || "unknown"
      )

      handler({data: eventData})

      // Auto-close browser after successful authentication
      console.log(
        "Auto-closing Browser - Authentication complete, closing browser"
      )
      close()
    } catch (error) {
      console.log(
        "Browser Callback Parse Error - Failed to parse FCL response:",
        error.message || error
      )
    }
  }

  const [browser, unmount] = await renderBrowser(
    serviceEndpoint(service, config, body)
  )
  // Android deeplink parsing
  LinkingModule.addEventListener("url", parseDeeplink)
  // iOS deeplink parsing
  browser.then(parseDeeplink).catch(error => {
    console.log("Browser Promise Error:", error.message || error)
  })
  return {send: noop, close}

  function close() {
    try {
      unmount()
      onClose()
    } catch (error) {
      console.log(
        "Frame Close Error - Error closing frame:",
        error.message || error
      )
    }
  }
}
