import {URL} from "../../../../utils/url"

export function serviceEndpoint(service, config, body) {
  const url = new URL(service.endpoint)
  url.searchParams.append('fclMessageJson', JSON.stringify({config, body}))

  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  console.log(url.toString())
  return url
}
