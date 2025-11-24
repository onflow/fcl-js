import {renderBrowser} from "./render-browser"
import {renderDeeplink} from "./render-deeplink"

const NOT_IMPLEMENTED = strategy => () => {
  throw new Error(
    `${strategy} Strategy util has not been implemented on this platform`
  )
}

const VIEWS = {
  // In React Native, VIEW/IFRAME, VIEW/POP, and VIEW/TAB all open in mobile browser
  "VIEW/IFRAME": renderBrowser,
  "VIEW/POP": renderBrowser,
  "VIEW/TAB": renderBrowser,
  "VIEW/MOBILE_BROWSER": renderBrowser,
  "VIEW/DEEPLINK": renderDeeplink,
}

export async function execLocal(
  service,
  opts = {serviceEndpoint: () => {}, onClose: () => {}}
) {
  const {serviceEndpoint} = opts
  return VIEWS[service.method](serviceEndpoint(service), opts)
}
