import {withPrefix} from "@onflow/util-address"
import {SERVICE_PRAGMA} from "./__vsn"

// {
//   "f_type": "Service",
//   "f_vsn": "1.0.0",
//   "type": "signature",
//   "method": "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
//   "uid": "uniqueDedupeKey",
//   "endpoint": "https://rawr",
//   "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
//   "identity": {
//     "f_type": "Identity",
//     "f_vsn": "1.0.0",
//     "address": "0x____",
//     "keyId": 1,
//   },
//   "provider": {
//     "address": "0x____",
//     "name": "Best Wallet",
//     "description": "The Best Wallet"
//     "icon": "https://",
//   },
//   "data": {}, // included in body of authz request
//   "params": {}, // included as query params on endpoint url
// }
export function normalizeSignature(service) {
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
        identity: {
          ...IDENTITY_PRAGMA,
          address: withPrefix(service.addr),
          keyId: service.keyId,
        },
        provider: {
          address: withPrefix(service.addr),
          name: service.name,
          icon: service.icon,
        },
        params: service.params,
        data: service.data,
      }
  }
}
