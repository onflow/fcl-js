import {URL} from "../utils/url"

export function urlFromService(service, includeParams = true) {
  const url = new URL(service.endpoint)
  if (includeParams) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
