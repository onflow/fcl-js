import { renderWebview } from "./strategies/utils/render-webview"
import {serviceEndpoint} from "./strategies/utils/service-endpoint"

const VIEWS = {
  "VIEW/IFRAME": renderWebview,
  "VIEW/POP": renderWebview,
  "VIEW/TAB": renderWebview,
}

export async function execLocal(service, opts = {}) {
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
