import {URL} from "../../../../utils/url"

export function serviceEndpoint(service, config) {
  const url = new URL(service.endpoint)

  if(config) {
    url.searchParams.append('fclMessageJson', JSON.stringify({config}))
  }

  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  console.log(url.toString())
  return url
}
