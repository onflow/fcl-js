import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"

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
    invariant(servicePlugins.length, "Discovery services are required")
    setServices(servicePlugins)
    for (const s of servicePlugins) {
      if (!strategies.has(s.definition?.method)) {
        strategies.set(s.definition?.method, s.strategy)
      } else {
        log({
          title: `Add Service Plugin`,
          message: `Service strategy for ${s.definition.method} already exists`,
          level: 2,
        })
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

const validatePlugins = plugins => {
  let pluginsArray
  invariant(plugins, "No plugins supplied")

  if (!Array.isArray(plugins)) {
    pluginsArray = [plugins]
  } else {
    pluginsArray = [...plugins]
  }
  for (const p of pluginsArray) {
    invariant(p.name, "Plugin name is required")
    invariant(
      supportedPlugins.includes(p.type),
      `Plugin type ${p.type} is not supported`
    )
  }

  return pluginsArray
}

const PluginRegistry = () => {
  const pluginsMap = new Map()

  const getPlugins = () => pluginsMap

  const add = plugins => {
    const pluginsArray = validatePlugins(plugins)
    for (const p of pluginsArray) {
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
