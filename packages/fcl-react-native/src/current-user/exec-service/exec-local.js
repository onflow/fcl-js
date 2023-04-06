import { renderWebbrowser } from "./strategies/utils/render-webbrowser"
import {serviceEndpoint} from "./strategies/utils/service-endpoint"

const VIEWS = {
  "VIEW/IFRAME": renderWebbrowser,
  "VIEW/POP": renderWebbrowser,
  "VIEW/TAB": renderWebbrowser,
}

export async function execLocal(service, opts = {}) {
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
