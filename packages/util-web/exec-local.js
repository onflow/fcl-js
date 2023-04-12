import {renderFrame} from "./render-frame"
import {renderPop} from "./render-pop"
import {renderTab} from "./render-tab"

const VIEWS = {
  "VIEW/IFRAME": renderFrame,
  "VIEW/POP": renderPop,
  "VIEW/TAB": renderTab,
}

export async function execLocal(service, opts = {serviceEndpoint: () => {}}) {
  const { serviceEndpoint } = opts
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
