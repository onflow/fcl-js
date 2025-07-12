import {withPrefix} from "@onflow/util-address"
import {IDENTITY_PRAGMA, SERVICE_PRAGMA} from "./__vsn"
import {AuthzService} from "./authz"

/**
 * @description Normalizes a pre-authz service to ensure compatibility with FCL service format
 *
 * @param service The pre-authz service to normalize
 * @returns The normalized pre-authz service or null
 *
 * @example
 * const service = normalizePreAuthz({
 *   f_type: "service",
 *   f_vsn: "1.0.0",
 *   type: "pre-authz",
 *   uid: "uniqueDedupeKey",
 *   endpoint: "https://rawr",
 *   method: "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
 *   identity: {
 *     address: "0x______",
 *     keyId: 0,
 *   },
 * })
 */
export function normalizePreAuthz(
  service: AuthzService | null
): AuthzService | null {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      ...SERVICE_PRAGMA,
      type: service.type,
      uid: service.id,
      endpoint: service.endpoint,
      method: service.method,
      identity: {
        ...IDENTITY_PRAGMA,
        address: withPrefix(service.addr!),
        keyId: service.keyId,
      },
      params: service.params,
      data: service.data,
    } as AuthzService
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
