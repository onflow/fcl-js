import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {VERSION} from "../VERSION"

const asyncPipe = (...fns) => input => fns.reduce((chain, fn) => chain.then(fn), Promise.resolve(input))

async function addServices(services = []) {
  const endpoint = await config.get("discovery.authn.endpoint")
  invariant(Boolean(endpoint), `"discovery.authn.endpoint" in config must be defined.`)

  const include = await config.get("discovery.authn.include", [])
  const url = new URL(endpoint)

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fclVersion: VERSION,
      include
    })
  }).then(d => d.json())
  .then(json => [...services, ...json])
}

function addExtensions(services = []) {
  const extensions = window.fcl_extensions || []
  return [...extensions, ...services]
}

function filterServicesByType(services = [], type) {
  return services.filter(service => service.type === type)
}

export const getServices = ({ type }) => asyncPipe(
  addServices,
  addExtensions,
  s => filterServicesByType(s, type)
)([])