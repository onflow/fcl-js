import {withPrefix} from "@onflow/util-address"
import {SERVICE_PRAGMA} from "./__vsn"

// {
//   "f_type": "Service",
//   "f_vsn": "1.0.0",
//   "type": "user-signature",
//   "uid": "uniqueDedupeKey",
//   "endpoint": "https://rawr",
//   "method": "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
//   "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
//   "params": {}, // included as query params on endpoint url
//   "data": {}, // included in body of user-signature request
// }
export function normalizeUserSignature(service) {
  if (service == null) return null

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return {
        ...SERVICE_PRAGMA,
        type: service.type,
        uid: service.id,
        endpoint: service.endpoint,
        method: service.method,
        id: service.pid,
        params: service.params,
        data: service.data,
      }
  }
}
