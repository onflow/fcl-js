import {withPrefix} from "@onflow/util-address"
import {SERVICE_PRAGMA} from "./__vsn"

// {
//   "f_type": "Service",
//   "f_vsn": "1.0.0",
//   "type": "authn",
//   "uid": "uniqueDedupeKey",
//   "endpoint": "https://rawr",
//   "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
//   "identity": {
//     "address": "0x____"
//   },
//   "provider": {
//     "address": "0x____",
//     "name": "Best Wallet",
//     "description": "The Best Wallet"
//     "icon": "https://",
//   }
// }
export function normalizeAuthn(service) {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      ...SERVICE_PRAGMA,
      type: service.type,
      uid: service.id,
      endpoint: service.authn,
      id: service.pid,
      provider: {
        address: withPrefix(service.addr),
        name: service.name,
        icon: service.icon,
      },
    }
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
