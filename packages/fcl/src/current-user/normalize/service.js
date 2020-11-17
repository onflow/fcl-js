import {withPrefix} from "@onflow/util-address"
import {SERVICE_PRAGMA, IDENTITY_PRAGMA, PROVIDER_PRAGMA} from "./__vsn"

export function normalizeServices(services, data) {
  return services.map((service) => normalizeService(service, data))
}

const serviceNormalizers = {
  authn: normalizeAuthn,
  authz: normalizeAuthz,
  "pre-authz": normalizePreAuthz,
}

export function normalizeService(service, data) {
  try {
    var normalized = serviceNormalizers[service.type](service, data)
    console.log(service.type, {normalized, service})
    return normalized
  } catch (error) {
    console.error(
      `Unrecognized FCL Service Type [${service.type}]`,
      service,
      error
    )
    return service
  }
}

// {
//   "@type": "service",
//   "@vsn": "1.0.0",
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
function normalizeAuthn(service) {
  switch (service["@vsn"]) {
    case "1.0.0":
      return service

    default:
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
}

// {
//   "@type": "service",
//   "@vsn": "1.0.0",
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
function normalizeAuthz(service) {
  switch (service["@vsn"]) {
    case "1.0.0":
      return service

    default:
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
}

// {
//   "@type": "service",
//   "@vsn": "1.0.0",
//   "type": "pre-authz",
//   "uid": "uniqueDedupeKey",
//   "endpoint": "https://rawr",
//   "method": "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
//   "identity": {
//      "address": "0x______",
//      "keyId": 0,
//   },
//   "data": {}, // included in body of pre-authz request
//   "params": {}, // included as query params on endpoint url
// }
function normalizePreAuthz(service) {
  switch (service["@vsn"]) {
    case "1.0.0":
      return service

    default:
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
}
