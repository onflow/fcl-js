import {fetchServices} from "./fetch-services"
import {mergeServices} from "./merge-services"
import {withPrefix} from "@onflow/util-address"

function deriveCompositeId(authn) {
  return `cid:${authn.addr || authn.name}:${authn.pid}`
}

export async function buildUser(data) {
  const services = mergeServices(
    data.services || [],
    await fetchServices(data.hks, data.code)
  )

  const authn = services.find((d) => d.type === "authn")
  const addr = console.log("RAWR", {data, services, authn})

  return {
    addr: data.addr ? withPrefix(data.addr) : null,
    cid: deriveCompositeId(authn),
    loggedIn: true,
    // verified: false,
    services: services,
  }
}
