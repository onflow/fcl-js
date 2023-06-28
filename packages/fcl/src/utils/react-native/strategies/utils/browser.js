import {renderBrowser} from "../../render-browser"
import { serviceEndpoint } from "../../../../current-user/exec-service/strategies/utils/service-endpoint"

const noop = () => {}

export function browser(service, opts = {}) {
  if (service == null) return {send: noop, close: noop}

  const onClose = opts.onClose || noop

  const [_, unmount] = renderBrowser(serviceEndpoint(service))
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
