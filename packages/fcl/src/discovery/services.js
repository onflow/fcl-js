import {config} from "@onflow/sdk"
import {invariant} from "@onflow/util-invariant"

const SERVICES_PLATFORMS = {
  EXTENSION: "web/extension"
}

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    
    if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) return false
  }

  return true
}

const isObject = object => object != null && typeof object === "object"

const asyncPipe = (...fns) => input => fns.reduce((chain, fn) => chain.then(fn), Promise.resolve(input))

async function addServices(services = []) {
  const endpoint = await config.get("discovery.authn.endpoint")
  invariant(Boolean(endpoint), `"discovery.authn.endpoint" in config must be defined.`)
  const url = new URL(endpoint)

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(d => d.json())
  .then(json => [...services, ...json])
}

function filterServicesByType(services = [], type) {
  return services.filter(service => service.type === type)
}

// Only show extensions from list if they are injected
function filterAllowedExtensions(services = []) {
  const extensions = window.fcl_extensions || []

  return services.filter(service => {
    let showService = false
    
    if (service.platform && service.platform !== SERVICES_PLATFORMS.EXTENSION) showService = true

    for (const extension of extensions) {
      if (deepEqual(extension, service)) {
        showService = true
      }
    }

    return showService
  })
}

export const getServices = ({ type }) => asyncPipe(
  addServices,
  s => filterServicesByType(s, type),
  filterAllowedExtensions
)([])