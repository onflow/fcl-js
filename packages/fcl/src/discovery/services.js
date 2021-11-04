import {config} from "@onflow/sdk"
import {invariant} from "@onflow/util-invariant"

async function fetchServices() {
  const endpoint = await config.first(["discovery.authn.api"])
  invariant(Boolean(endpoint), `"discovery.authn.api" in config must be defined.`)
  const url = new URL(endpoint)

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(d => d.json())
}

function getExtensions() {
  return window.fcl_extensions || []
}

function filterServices(services = [], type) {
  return services.filter(service => service.type === type)
}

export async function getServices({ type }) {
  try {
    const extensions = getExtensions()
    const services = await fetchServices()
    const combinedServices = [...extensions, ...services]
    return filterServices(combinedServices, type)
  } catch(e) {
    return []
  }
}