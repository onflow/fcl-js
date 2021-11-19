import {withPrefix} from "@onflow/util-address"
import * as rlp from "@onflow/rlp"
import {fetchServices} from "./fetch-services"
import {mergeServices} from "./merge-services"
import {USER_PRAGMA} from "./normalize/__vsn"
import {normalizeService} from "./normalize/service"

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

function findService(type, services) {
  return services.find(d => d.type === type)
}

export async function buildUser(data) {
  data = normalizeData(data)

  var services = mergeServices(
    data.services || [],
    await fetchServices(data.hks, data.code)
  ).map(service => normalizeService(service, data))

  const authn = findService("authn", services)

  return {
    ...USER_PRAGMA,
    addr: withPrefix(data.addr),
    cid: deriveCompositeId(authn),
    loggedIn: true,
    services: services,
    expiresAt: data.expires,
  }
}
