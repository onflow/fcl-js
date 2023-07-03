import * as Linking from 'expo-linking'
import {renderBrowser} from "../../render-browser"
import { serviceEndpoint } from "./service-endpoint"
import { buildMessageHandler } from "../../../../current-user/exec-service/strategies/utils/buildMessageHandler"
import { FCL_RESPONSE_PARAM_NAME } from '../../../constants'

const noop = () => {}

export function browser(service, config, opts = {}) {
  const send = noop
  if (service == null) return {send, close: noop}
  
  const onClose = opts.onClose || noop
  const onMessage = noop
  const onReady = noop
  const onResponse = opts.onResponse || noop

  const handler = buildMessageHandler({
    close,
    send,
    onReady,
    onResponse,
    onMessage,
  })
  const parseDeeplink = (url) => {
    const { queryParams } = Linking.parse(url);
    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME]
    const eventData = JSON.parse(eventDataRaw)
    
    console.log({eventData})
    handler({data: eventData})
  }
  
  const [browser, unmount] = renderBrowser(serviceEndpoint(service, config))
  // Android deeplink parsing
  Linking.addEventListener("url", ({url}) => parseDeeplink(url))
  // iOS deeplink parsing
  browser.then(({url}) =>parseDeeplink(url))
  return {send, close}

  function close() {
    try {
      unmount()
      onClose()
    } catch (error) {
      console.error("Frame Close Error", error)
    }
  }
}
