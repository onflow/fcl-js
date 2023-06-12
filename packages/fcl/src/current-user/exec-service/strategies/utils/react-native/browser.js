import {serviceEndpoint} from "../shared/service-endpoint"
import { renderBrowser } from "./render/render-browser"
import * as Linking from 'expo-linking'

const noop = () => {}

export function browser(service, opts = {}) {
  if (service == null) return noop

  const onClose = opts.onClose || noop
  const onReady = opts.onReady || noop
  const onResponse = opts.onResponse || noop

  asyncThing({onClose, onReady, onResponse, service})
}

async function asyncThing({onClose, onReady, onResponse, service}) {
  const data = await new Promise(resolve => onReady(null, {send: resolve}))
  const [$browser, unmount] = renderBrowser(serviceEndpoint(service).toString(), data)

  $browser.then(result => {
    if (result.type === 'success') {
      const url = Linking.parse(result.url);
      const response = JSON.parse(url.queryParams?.fclResponseJson);

      onResponse(response, {close})
    }
  })

  function close() {
    try {
      unmount()
      onClose()
    } catch (error) {
      console.error("Frame Close Error", error)
    }
  }
  return close
}