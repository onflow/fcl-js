import {Service} from "@onflow/typedefs"
import {serviceEndpoint} from "./service-endpoint"

export interface FetchServiceOptions {
  method?: "GET" | "POST"
  data?: Record<string, any>
  headers?: Record<string, string>
}

export function fetchService(
  service: Service,
  opts: FetchServiceOptions = {}
): Promise<any> {
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
