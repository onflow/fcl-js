import {withPrefix} from "@onflow/util-address"
import {SERVICE_PRAGMA, IDENTITY_PRAGMA} from "./__vsn"

// {
//   "f_type": "service",
//   "f_vsn": "1.0.0",
//   "type": "authz",
//   "uid": "uniqueDedupeKey",
//   "endpoint": "https://rawr",
//   "method": "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
//   "identity": {
//      "address": "0x______",
//      "keyId": 0,
//   },
//   "data": {}, // included in body of authz request
//   "params": {}, // included as query params on endpoint url
// }
export function normalizeAuthz(service) {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      ...SERVICE_PRAGMA,
      type: service.type,
      uid: service.id,
      endpoint: service.endpoint,
      method: service.method,
      identity: {
        ...IDENTITY_PRAGMA,
        address: withPrefix(service.addr),
        keyId: service.keyId,
      },
      params: service.params,
      data: service.data,
    }
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
