import {SERVICE_PRAGMA} from "./__vsn"

// {
//    "f_type": "Service",
//    "f_vsn": "1.0.0",
//    "type": "frame",
//    "endpoint": "https://rawr",
//    "data": {},   // Sent to frame when ready
//    "params": {}, // include in query params on frame
// }
export function normalizeFrame(service) {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      old: service,
      ...SERVICE_PRAGMA,
      type: "frame",
      endpoint: service.endpoint,
      params: service.params || {},
      data: service.data || {},
    }
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
