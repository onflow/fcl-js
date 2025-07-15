import {Service} from "@onflow/typedefs"
import {serviceEndpoint} from "./service-endpoint"

export interface FetchServiceOptions {
  method?: "GET" | "POST"
  data?: Record<string, any>
  headers?: Record<string, string>
}

/**
 * @description Makes an HTTP request to a service endpoint with the specified options.
 * This utility function handles the common patterns for communicating with wallet services
 * including proper headers, body serialization, and JSON response parsing.
 *
 * @param service The service configuration containing endpoint and headers
 * @param opts Optional request configuration including method, data, and headers
 * @returns Promise resolving to the parsed JSON response
 *
 * @example
 * // Fetch from a service endpoint
 * const response = await fetchService(service, {
 *   method: "POST",
 *   data: { transaction: "..." },
 *   headers: { "Authorization": "Bearer token" }
 * })
 */
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
