export function serviceEndpoint(service) {
  const url = new URL(service.endpoint)
  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
