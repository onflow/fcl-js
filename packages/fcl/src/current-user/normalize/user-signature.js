// {
//   "f_type": "Service",
//   "f_vsn": "1.0.0",
//   "type": "user-signature",
//   "uid": "uniqueDedupeKey",
//   "endpoint": "https://rawr",
//   "method": "IFRAME/RPC", // HTTP/POST | IFRAME/RPC | HTTP/RPC
//   "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
//   "data": {}, // included in body of user-signature request
//   "params": {}, // included as query params on endpoint url
// }
export function normalizeUserSignature(service) {
  if (service == null) return null

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      throw new Error("Invalid user-signature service")
  }
}
