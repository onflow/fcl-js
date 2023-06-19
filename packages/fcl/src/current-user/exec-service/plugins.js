import {getExecHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {isRequired, isString, isObject, isFunc} from "../../exec/utils/is"

const CORE_STRATEGIES = {
  "HTTP/RPC": "HTTP/RPC",
  "HTTP/POST": "HTTP/POST",
  "IFRAME/RPC": "IFRAME/RPC",
  "POP/RPC": "POP/RPC",
  "TAB/RPC": "TAB/RPC",
  "EXT/RPC": "EXT/RPC",
}

const getCoreStrategies = ({execLocal}) => ({
  [CORE_STRATEGIES["EXT/RPC"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["HTTP/POST"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["IFRAME/RPC"]]: execIframeRPC,
  [CORE_STRATEGIES["POP/RPC"]]: execPopRPC,
  [CORE_STRATEGIES["TAB/RPC"]]: execTabRPC,
  [CORE_STRATEGIES["EXT/RPC"]]: execExtRPC,
})

const supportedPlugins = ["ServicePlugin"]
const supportedServicePlugins = ["discovery-service"]

const validateDiscoveryPlugin = servicePlugin => {
  const {services, serviceStrategy} = servicePlugin
  invariant(
    Array.isArray(services) && services.length,
    "Array of Discovery Services is required"
  )

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

const ServiceRegistry = ({execLocal}) => {
  let services = new Set()
  let strategies = new Map(Object.entries(getCoreStrategies({execLocal})))

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
          level: LEVELS.warn,
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

let serviceRegistry
const getIsServiceRegistryInitialized = () => typeof serviceRegistry !== 'undefined'

export const initServiceRegistry = ({execLocal}) => {
  if (getIsServiceRegistryInitialized()) {
    return serviceRegistry
  }
  const _serviceRegistry = ServiceRegistry({execLocal});
  serviceRegistry = _serviceRegistry;

  return _serviceRegistry
}
export const getServiceRegistry = () => {
  if (!getIsServiceRegistryInitialized()) {
    console.warn("Registry is not initalized, it will be initialized with a stub execLocal")

    return initServiceRegistry({execLocal: () => {}})
  }

  return serviceRegistry
}
export const pluginRegistry = PluginRegistry()
