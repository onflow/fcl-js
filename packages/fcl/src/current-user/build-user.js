import {withPrefix} from "@onflow/util-address"
import * as rlp from "@onflow/rlp"
import {fetchServices} from "./fetch-services"
import {mergeServices} from "./merge-services"
import {USER_PRAGMA} from "../normalizers/service/__vsn"
import {
  normalizeService,
  normalizeServices,
} from "../normalizers/service/service"
import {serviceOfType} from "./service-of-type"

function deriveCompositeId(authn) {
  return rlp
    .encode([
      authn.provider.address || authn.provider.name || "UNSPECIFIED",
      authn.id,
    ])
    .toString("hex")
}

function normalizeData(data) {
  data.addr = data.addr ? withPrefix(data.addr) : null
  data.paddr = data.paddr ? withPrefix(data.paddr) : null
  return data
}

export async function buildUser(data) {
  data = normalizeData(data)

  var services = normalizeServices(
    mergeServices(data.services || [], await fetchServices(data.hks, data.code))
  )

  const authn = serviceOfType(services, "authn")

  return {
    ...USER_PRAGMA,
    addr: withPrefix(data.addr),
    cid: deriveCompositeId(authn),
    loggedIn: true,
    services: services,
    expiresAt: data.expires,
  }
}
