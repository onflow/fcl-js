import {config} from "@onflow/sdk"
import {invariant} from "@onflow/util-invariant"

const asyncPipe = (...fns) => input => fns.reduce((chain, fn) => chain.then(fn), Promise.resolve(input))

async function addServices(services = []) {
  const endpoint = await config.get("discovery.authn.endpoint")
  invariant(Boolean(endpoint), `"discovery.authn.endpoint" in config must be defined.`)

  const include = await config.get("discovery.authn.include", [])
  const queryParams = constructApiQueryParams({include})
  const constructedEndpoint = `${endpoint}${queryParams}`
  const url = new URL(constructedEndpoint)

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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

// If it's an optIn service, make sure it's set in the config to show
async function filterOptInServices(services = []) {
  const optInList = await config.get("discovery.authn.include", [])
  return services.filter(service => {
    if (service.optIn) return optInList.includes(service?.provider?.address)
    return true
  })
}

export const getServices = ({ type }) => asyncPipe(
  addServices,
  addExtensions,
  s => filterServicesByType(s, type),
  filterOptInServices
)([])

export const constructApiQueryParams = ({ include }) => {
  let queryStr = '?'
  
  if (include) {
    let includeQueryStr = include.map(addr => `include=${addr}`).join('&')
    queryStr = queryStr.concat(includeQueryStr)
  }

  return queryStr
}