import {URL} from "@onflow/fcl-core"

const isBodyEmpty = body => {
  return (
    !body ||
    (body?.data !== undefined &&
      Object.keys(body).filter(key => key !== "data").length === 0)
  )
}

export function serviceEndpoint(service, config, body) {
  const url = new URL(service.endpoint)
  if (!isBodyEmpty(body)) {
    url.searchParams.append("fclMessageJson", JSON.stringify({...body, config}))
  } else {
    url.searchParams.append("fclMessageJson", JSON.stringify({config}))
  }

  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
