import {URL} from "../utils/url"
import {Service} from "@onflow/typedefs"

export function urlFromService(
  service: Service,
  includeParams: boolean = true
): URL {
  const url = new URL(service.endpoint)
  if (includeParams) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
