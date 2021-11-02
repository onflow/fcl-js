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

export async function getServices() {
  try {
    return await fetchServices()
  } catch(e) {
    return []
  }
}