import * as semver from "@onflow/util-semver"
import {Service} from "@onflow/typedefs"

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
