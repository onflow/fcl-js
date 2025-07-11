import {withPrefix} from "@onflow/util-address"
import {IDENTITY_PRAGMA, SERVICE_PRAGMA} from "./__vsn"
import {Service} from "@onflow/typedefs"

export interface AuthzService extends Service {
  id?: string
  addr?: string
  keyId?: number
  identity?: any
}

/**
 * @description Normalizes an authz service to ensure compatibility with FCL service format
 *
 * @param service The authz service to normalize
 * @returns The normalized authz service or null
 *
 * @example
 * const service = normalizeAuthz({
 *   f_type: "service",
 *   f_vsn: "1.0.0",
 *   type: "authz",
 *   uid: "uniqueDedupeKey",
 *   endpoint: "https://rawr",
 *   method: "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
 *   identity: {
 *     address: "0x______",
 *     keyId: 0,
 *   },
 *   data: {}, // included in body of authz request
 *   params: {}, // included as query params on endpoint url
 * })
 */
export function normalizeAuthz(
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
