import {renderFrame} from "./strategies/utils/render-frame"
import {renderPop} from "./strategies/utils/render-pop"
import {serviceEndpoint} from "./strategies/utils/service-endpoint"

const VIEWS = {
  "VIEW/IFRAME": renderFrame,
  "VIEW/POP": renderPop,
}

export async function execLocal(service, opts = {}) {
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
