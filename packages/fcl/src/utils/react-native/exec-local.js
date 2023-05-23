import {renderBrowser} from "./render-browser"

const VIEWS = {
  "VIEW/IFRAME": renderBrowser,
  "VIEW/POP": renderBrowser,
  "VIEW/TAB": renderBrowser,
}

export async function execLocal(service, opts = {serviceEndpoint: () => {}}) {
  const {serviceEndpoint} = opts
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts)
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {service, opts})
    throw error
  }
}
