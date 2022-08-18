import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"

const CORE_STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
  "TAB/RPC": execTabRPC,
  "EXT/RPC": execExtRPC,
}

const supportedPlugins = ["discovery-service"]

const ServiceRegistry = () => {
  let services = new Set()
  let strategies = new Map(Object.entries(CORE_STRATEGIES))

  const setServices = pluginServices =>
    (services = new Set([...pluginServices]))

  const getServices = () => [...services].map(service => service.definition)

  const add = servicePlugins => {
    setServices(servicePlugins)
    for (const s of servicePlugins) {
      if (!strategies.has(s.definition?.method)) {
        strategies.set(s.definition?.method, s.strategy)
      } else {
        console.warn(
          `Service strategy for ${s.definition.method} already exists`
        )
      }
    }
  }
  const getStrategy = method => strategies.get(method)
  return Object.freeze({
    add,
    getServices,
    getStrategy,
  })
}

const PluginRegistry = () => {
  const pluginsMap = new Map()

  const getPlugins = () => pluginsMap
  const add = plugins => {
    let pluginsArray
    if (plugins == null) throw new Error("No plugins supplied")
    if (!Array.isArray(plugins)) {
      pluginsArray = [plugins]
    } else {
      pluginsArray = [...plugins]
    }
    for (const p of pluginsArray) {
      if (!supportedPlugins.includes(p.type)) {
        throw new Error(`Plugin type ${p.type} is not supported`)
      }
      pluginsMap.set(p.name, p)
      if (p.type === "discovery-service") {
        serviceRegistry.add(p.services)
      }
    }
  }
  return Object.freeze({
    add,
    getPlugins,
  })
}

export const serviceRegistry = ServiceRegistry()
export const pluginRegistry = PluginRegistry()
