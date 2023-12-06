import {renderBrowser} from "./render-browser"
import {renderDeeplink} from "./render-deeplink"

const NOT_IMPLEMENTED = strategy => () => {
  throw new Error(
    `${strategy} Strategy util has not been implemented on this platform`
  )
}

const VIEWS = {
  "VIEW/IFRAME": NOT_IMPLEMENTED("VIEW/IFRAME"),
  "VIEW/POP": NOT_IMPLEMENTED("VIEW/IFRAME"),
  "VIEW/TAB": NOT_IMPLEMENTED("VIEW/TAB"),
  "VIEW/MOBILE_BROWSER": renderBrowser,
  "VIEW/DEEPLINK": renderDeeplink,
}

export async function execLocal(
  service,
  opts = {serviceEndpoint: () => {}, onClose: () => {}}
) {
  const {serviceEndpoint} = opts
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
