import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isRequired, isString, isObject, isFunc} from "../../exec/utils/is"

const CORE_STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
  "TAB/RPC": execTabRPC,
  "EXT/RPC": execExtRPC,
}

const supportedPlugins = ["discovery-service"]

const validateDiscoveryServices = discoveryServices => {
  let discoveryServiceArray
  invariant(discoveryServices.length, "Discovery services are required")

  if (!Array.isArray(discoveryServices)) {
    discoveryServiceArray = [discoveryServices]
  } else {
    discoveryServiceArray = [...discoveryServices]
  }
  for (const ds of discoveryServiceArray) {
    invariant(
      isRequired(ds.definition) &&
        isObject(ds.definition) &&
        ds.definition.f_type === "Service",
      "Service definition is required"
    )
    invariant(
      isRequired(ds.strategy) && isFunc(ds.strategy),
      "Service strategy is required"
    )
  }

  return discoveryServiceArray
}

const ServiceRegistry = () => {
  let services = new Set()
  let strategies = new Map(Object.entries(CORE_STRATEGIES))

  const setServices = discoveryServicePlugins =>
    (services = new Set([...discoveryServicePlugins]))

  const getServices = () => [...services].map(service => service.definition)

  const add = discoveryServices => {
    const discoveryServicesArray = validateDiscoveryServices(discoveryServices)

    setServices(discoveryServicesArray)
    for (const dsp of discoveryServicesArray) {
      if (!strategies.has(dsp.definition?.method)) {
        strategies.set(dsp.definition?.method, dsp.strategy)
      } else {
        log({
          title: `Add Service Plugin`,
          message: `Service strategy for ${dsp.definition.method} already exists`,
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
    invariant(isRequired(p.name), "Plugin name is required")
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
        serviceRegistry.add(p.discoveryServices)
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
