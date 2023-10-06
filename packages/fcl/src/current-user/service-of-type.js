import * as semver from "@onflow/util-semver"

export function serviceOfType(services = [], type) {
  // Find the greatest version of the service type
  return services.reduce(
    (mostRecent, service) =>
      service.type === type
        ? !mostRecent || semver.compare(service.f_vsn, mostRecent.f_vsn) > 0
          ? service
          : mostRecent
        : mostRecent,
    null
  )
}
