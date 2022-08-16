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

const ServiceRegistry = () => {
  let services = []
  let strategies = new Map(Object.entries(CORE_STRATEGIES))

  const setServices = pluginServices =>
    (services = [...services, ...pluginServices])

  const getServices = () => services
  const add = servicePlugins => {
    setServices(servicePlugins.services)
    for (const s of servicePlugins.services) {
      if (!strategies.has(s.method)) {
        strategies.set(s.method, servicePlugins.serviceStrategy)
      } else {
        console.warn(`Service strategy for ${s.method} already exists`)
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

const supportedPlugins = ["DiscoveryService"]

export const serviceRegistry = ServiceRegistry()

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
      if (p.type === "DiscoveryService") {
        //serviceRegistry.add(p.services)
        serviceRegistry.add(p)
      }
    }
  }
  return Object.freeze({
    add,
    getPlugins,
  })
}

export const pluginRegistry = PluginRegistry()
