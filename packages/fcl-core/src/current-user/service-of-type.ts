import * as semver from "@onflow/util-semver"
import {Service} from "@onflow/typedefs"

/**
 * @description Finds a service of a specific type from an array of services, returning the one with
 * the highest version number. This is used internally by FCL to select the most recent version
 * of a service when multiple services of the same type are available.
 *
 * @param services Array of services to search through
 * @param type The type of service to find (e.g., "authn", "authz", "user-signature")
 * @returns The service with the highest version number of the specified type, or null if none found
 *
 * @example
 * // Find the latest authentication service
 * const services = [
 *   { type: "authn", f_vsn: "1.0.0", endpoint: "..." },
 *   { type: "authn", f_vsn: "1.1.0", endpoint: "..." },
 *   { type: "authz", f_vsn: "1.0.0", endpoint: "..." }
 * ]
 * const latestAuthn = serviceOfType(services, "authn")
 */
export function serviceOfType(
  services: Service[] = [],
  type: string
): Service | null {
  // Find the greatest version of the service type
  return services.reduce(
    (mostRecent, service) =>
      service.type === type
        ? !mostRecent || semver.compare(service.f_vsn, mostRecent.f_vsn) > 0
          ? service
          : mostRecent
        : mostRecent,
    null as Service | null
  )
}
