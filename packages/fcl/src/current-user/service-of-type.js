import {invariant} from "@onflow/util-invariant"

function compareVersions(a, b) {
  function helper(a, b) {
    if (a.length === 0) return 0
    if (a[0] > b[0]) return true
    if (a[0] < b[0]) return false
    return helper(a.slice(1), b.slice(1))
  }
  const aVsn = a.split(".")
  const bVsn = b.split(".")

  invariant(aVsn.length === 3, "Invalid version: " + a)
  invariant(bVsn.length === 3, "Invalid version: " + b)

  return helper(a.split("."), b.split("."))
}

export function serviceOfType(services = [], type) {
  // Find the greatest version of the service type
  return services.reduce(
    (service, mostRecent) =>
      !mostRecent ||
      (service.type === type &&
        compareVersions(service.f_vsn, mostRecent.f_vsn))
        ? service
        : mostRecent,
    null
  )
}
