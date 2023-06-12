import {renderFrame} from "../../current-user/exec-service/strategies/utils/web/render/render-frame"
import {renderPop} from "../../current-user/exec-service/strategies/utils/web/render/render-pop"
import {renderTab} from "../../current-user/exec-service/strategies/utils/web/render/render-tab"

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
