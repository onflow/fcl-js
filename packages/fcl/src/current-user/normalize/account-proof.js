// {
//   "f_type": "Service",
//   "f_vsn": "1.0.0",
//   "type": "account-proof",
//   "method": "DATA",
//   "uid": "awesome-wallet#account-proof",
//   "data": {
//     "f_type": "account-proof",
//     "f_vsn": "1.0.0",
//     "address": "0xUSER",   // The users address
//     "timestamp": 1630705495551, // UNIX timestamp
//     "appDomainTag": "AWESOME_DAPP", // Optional, but recommended. Defaults to "APP-V0.0-user"
//     "signature": CompositeSignature, // Optional
//    }
// }

export function normalizeAccountProof(service) {
  if (service == null) return null

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      throw new Error("Invalid account-proof service")
  }
}
