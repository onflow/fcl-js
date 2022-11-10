export function serviceEndpoint(service) {
  const url = new URL(service.endpoint)
  url.searchParams.append("l6n", window.location.origin)
  if (service.params != null) {
    for (let [key, value] of Object.entries<string>(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
