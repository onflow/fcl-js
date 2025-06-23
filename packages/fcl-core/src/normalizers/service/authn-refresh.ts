import {Service} from "@onflow/typedefs"

export interface AuthnRefreshService extends Service {
  id?: string
  addr?: string
  name?: string
  icon?: string
  authn?: string
  pid?: string
}

/**
 * @param service The authn-refresh service to normalize
 * @returns The normalized authn-refresh service or null
 *
 * @example
 * const service = normalizeAuthnRefresh({
 *   f_type: "Service",
 *   f_vsn: "1.0.0",
 *   type: "authn-refresh",
 *   uid: "uniqueDedupeKey",
 *   endpoint: "https://rawr",
 *   method: "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
 *   id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
 *   data: {}, // included in body of request
 *   params: {}, // included as query params on endpoint url
 * })
 */
export function normalizeAuthnRefresh(
  service: AuthnRefreshService | null
): AuthnRefreshService | null {
  if (service == null) return null

  if (!service["f_vsn"]) {
    throw new Error("Invalid authn-refresh service")
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
