import type {Service} from "@onflow/typedefs"

/**
 * @description Normalizes a user-signature service to ensure compatibility with FCL service format
 *
 * @param service The user-signature service to normalize
 * @returns The normalized user-signature service or null
 *
 * @example
 * const service = {
 *   "f_type": "Service",
 *   "f_vsn": "1.0.0",
 *   "type": "user-signature",
 *   "uid": "uniqueDedupeKey",
 *   "endpoint": "https://rawr",
 *   "method": "IFRAME/RPC", // HTTP/POST | IFRAME/RPC | HTTP/RPC
 *   "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
 *   "data": {}, // included in body of user-signature request
 *   "params": {}, // included as query params on endpoint url
 * }
 */
export function normalizeUserSignature(
  service: Service | null
): Service | null {
  if (service == null) return null

  if (!service["f_vsn"]) {
    throw new Error("Invalid user-signature service")
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
