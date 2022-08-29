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

const supportedPlugins = ["ServicePlugin"]
const supportedServicePlugins = ["discovery-service"]

const validateDiscoveryPlugin = servicePlugin => {
  const {services, serviceStrategy} = servicePlugin
  invariant(Array.isArray(services), "Array of Discovery Services is required")

  if (services.length) {
    for (const ds of services) {
      invariant(
        isRequired(ds.f_type) && ds.f_type === "Service",
        "Service is required"
      )
      invariant(
        isRequired(ds.type) && ds.type === "authn",
        `Service must be type authn. Received ${ds.type}`
      )
      invariant(
        ds.method in CORE_STRATEGIES || serviceStrategy.method === ds.method,
        `Service method ${ds.method} is not supported`
      )
    }
  }
  invariant(isRequired(serviceStrategy), "Service strategy is required")
  invariant(
    isRequired(serviceStrategy.method) && isString(serviceStrategy.method),
    "Service strategy method is required"
  )
  invariant(
    isRequired(serviceStrategy.exec) && isFunc(serviceStrategy.exec),
    "Service strategy exec function is required"
  )

  return {discoveryServices: services, serviceStrategy}
}

const ServiceRegistry = () => {
  let services = new Set()
  let strategies = new Map(Object.entries(CORE_STRATEGIES))

  const add = servicePlugin => {
    invariant(
      supportedServicePlugins.includes(servicePlugin.type),
      `Service Plugin type ${servicePlugin.type} is not supported`
    )
    if (servicePlugin.type === "discovery-service") {
      const {discoveryServices, serviceStrategy} =
        validateDiscoveryPlugin(servicePlugin)
      setServices(discoveryServices)
      if (!strategies.has(serviceStrategy.method)) {
        strategies.set(serviceStrategy.method, serviceStrategy.exec)
      } else {
        log({
          title: `Add Service Plugin`,
          message: `Service strategy for ${serviceStrategy.method} already exists`,
          level: 2,
        })
      }
    }
  }

  const setServices = discoveryServices =>
    (services = new Set([...discoveryServices]))

  const getServices = () => [...services]

  const getStrategy = method => strategies.get(method)

  const getStrategies = () => [...strategies.keys()]

  return Object.freeze({
    add,
    getServices,
    getStrategy,
    getStrategies,
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
    invariant(isRequired(p.f_type), "Plugin f_type is required")
    invariant(
      supportedPlugins.includes(p.f_type),
      `Plugin type ${p.f_type} is not supported`
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
      if (p.f_type === "ServicePlugin") {
        serviceRegistry.add(p)
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
