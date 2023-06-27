import {renderBrowser} from "./render-browser"

const NOT_IMPLEMENTED = () => {
  throw new Error("Strategy util has not been implemented on this platform")
}

const VIEWS = {
  "VIEW/IFRAME": NOT_IMPLEMENTED,
  "VIEW/POP": NOT_IMPLEMENTED,
  "VIEW/TAB": NOT_IMPLEMENTED,
  "VIEW/MOBILE_BROWSER": renderBrowser,
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
