import {normalizeAuthn} from "./authn"
import {normalizeAuthz} from "./authz"
import {normalizePreAuthz} from "./pre-authz"
import {normalizeFrame} from "./frame"
import {normalizeBackChannelRpc} from "./back-channel-rpc"
import {normalizeOpenId} from "./open-id"
import {normalizeUserSignature} from "./user-signature"
import {normalizeLocalView} from "./local-view"
import {normalizeAccountProof} from "./account-proof"
import {normalizeAuthnRefresh} from "./authn-refresh"
import type {Service} from "@onflow/typedefs"

/**
 * @description Normalizes an array of services by applying type-specific normalization to each service.
 * This function processes multiple services in batch, applying the appropriate normalizer based on
 * each service's type, and filters out any services that fail normalization.
 *
 * @param services Array of services to normalize
 * @param data Optional additional data to pass to individual service normalizers
 * @returns Array of normalized services with invalid services filtered out
 *
 * @example
 * // Normalize multiple services from wallet discovery
 * const rawServices = [
 *   { type: "authn", endpoint: "https://wallet.com/authn", ... },
 *   { type: "authz", endpoint: "https://wallet.com/authz", ... },
 *   { type: "user-signature", endpoint: "https://wallet.com/sign", ... }
 * ]
 *
 * const normalizedServices = normalizeServices(rawServices)
 * console.log("Normalized services:", normalizedServices)
 */
export function normalizeServices(services: Service[], data?: any): Service[] {
  return services
    .map(service => normalizeService(service, data))
    .filter(Boolean)
}

const serviceNormalizers: Record<
  string,
  (service: Service, data?: any) => any
> = {
  "back-channel-rpc": normalizeBackChannelRpc,
  "pre-authz": normalizePreAuthz,
  authz: normalizeAuthz,
  authn: normalizeAuthn,
  frame: normalizeFrame,
  "open-id": normalizeOpenId,
  "user-signature": normalizeUserSignature,
  "local-view": normalizeLocalView,
  "account-proof": normalizeAccountProof,
  "authn-refresh": normalizeAuthnRefresh,
}

/**
 * @description Normalizes a single service by applying the appropriate type-specific normalizer.
 * This function looks up the correct normalizer based on the service type and applies it to
 * ensure the service conforms to expected formats and contains required fields.
 *
 * @param service The service object to normalize
 * @param data Optional additional data to pass to the service normalizer
 * @returns The normalized service object
 *
 * @example
 * // Normalize an authentication service
 * const rawService = {
 *   type: "authn",
 *   endpoint: "https://wallet.example.com/authn",
 *   method: "HTTP/POST",
 *   // ... other service properties
 * }
 *
 * const normalized = normalizeService(rawService)
 * console.log("Normalized service:", normalized)
 */
export function normalizeService(service: Service, data?: any): Service {
  try {
    const normalized = serviceNormalizers[service.type](service, data)
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
