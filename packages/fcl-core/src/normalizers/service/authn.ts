import {Service} from "@onflow/typedefs"
import {withPrefix} from "@onflow/util-address"
import {SERVICE_PRAGMA} from "./__vsn"

export interface AuthnService extends Service {
  id?: string
  addr?: string
  name?: string
  icon?: string
  authn?: string
  pid?: string
}

/**
 * @description Normalizes an authn service to ensure compatibility with FCL service format
 *
 * @param service The authn service to normalize
 * @returns The normalized authn service or null
 *
 * @example
 * const service = normalizeAuthn({
 *   f_type: "Service",
 *   f_vsn: "1.0.0",
 *   type: "authn",
 *   uid: "uniqueDedupeKey",
 *   endpoint: "https://rawr",
 *   id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
 *   identity: {
 *     address: "0x____"
 *   },
 *   provider: {
 *     address: "0x____",
 *     name: "Best Wallet",
 *     description: "The Best Wallet",
 *     icon: "https://",
 *   }
 * })
 */
export function normalizeAuthn(
  service: AuthnService | null
): AuthnService | null {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      ...SERVICE_PRAGMA,
      type: service.type,
      uid: service.id,
      endpoint: service.authn,
      id: service.pid,
      provider: {
        address: withPrefix(service.addr!),
        name: service.name,
        icon: service.icon,
      },
    } as AuthnService
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
