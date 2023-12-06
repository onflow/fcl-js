import {URL} from "../../../../utils/url"

export function serviceEndpoint(service) {
  const url = new URL(service.endpoint)
  if (window?.location?.origin) {
    url.searchParams.append("l6n", window.location.origin)
  }
  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
