import {SERVICE_PRAGMA} from "./__vsn"
import {Service} from "@onflow/typedefs"

/**
 * @param service The back-channel-rpc service to normalize
 * @returns The normalized back-channel-rpc service or null
 *
 * @example
 * const service = normalizeBackChannelRpc({
 *   f_type: "Service",
 *   f_vsn: "1.0.0",
 *   type: "back-channel-rpc",
 *   endpoint: "https://rawr",
 *   method: "HTTP/GET", // HTTP/GET | HTTP/POST
 *   data: {},           // included in body of rpc
 *   params: {},         // included as query params on endpoint url
 * })
 */
export function normalizeBackChannelRpc(
  service: Service | null
): Service | null {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      ...SERVICE_PRAGMA,
      type: "back-channel-rpc",
      endpoint: service.endpoint,
      method: service.method,
      params: service.params || {},
      data: service.data || {},
    } as Service
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
