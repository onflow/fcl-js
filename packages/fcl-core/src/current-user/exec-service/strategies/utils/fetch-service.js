import {serviceEndpoint} from "./service-endpoint"

export function fetchService(service, opts = {}) {
  const method = opts.method || "POST"
  const body =
    method === "GET"
      ? undefined
      : JSON.stringify(opts.data || service.data || {})

  return fetch(serviceEndpoint(service), {
    method: method,
    headers: {
      ...(service.headers || {}),
      ...(opts.headers || {}),
      "Content-Type": "application/json",
    },
    body: body,
  }).then(d => d.json())
}
