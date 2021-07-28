import {renderFrame} from "./strategies/utils/render-frame"
import {renderPop} from "./strategies/utils/render-pop"
import {serviceEndpoint} from "./strategies/utils/service-endpoint"

const VIEWS = {
  "BROWSER/IFRAME": renderFrame,
  "VIEW/FRAME": renderFrame,
  "VIEW/POP": renderPop,
}

export async function execLocal(service, opts = {}) {
  const method = service.method || service.old.method || "BROWSER/IFRAME"
  try {
    return VIEWS[method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
