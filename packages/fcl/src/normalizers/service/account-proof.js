// {
//   "f_type": "Service",                    // Its a service!
//   "f_vsn": "1.0.0",                       // Follows the v1.0.0 spec for the service
//   "type": "account-proof",                // the type of service it is
//   "method": "DATA",                       // Its data!
//   "uid": "awesome-wallet#account-proof",  // A unique identifier for the service
//   "data": {
//     "f_type": "account-proof",
//     "f_vsn": "1.0.0",
//     "nonce": "0A1BC2FF",                  // Nonce signed by the current account-proof (minimum 32 bytes in total, i.e 64 hex characters)
//     "address": "0xUSER",                  // The user's address (8 bytes, i.e 16 hex characters)
//     "signature": CompositeSignature,      // address (sans-prefix), keyId, signature (hex)
// }

export function normalizeAccountProof(service) {
  if (service == null) return null

  if (!service["f_vsn"]) {
    throw new Error(`FCL Normalizer Error: Invalid account-proof service`)
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
