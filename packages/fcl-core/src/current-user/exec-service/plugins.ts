import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {isRequired, isString, isObject, isFunc} from "../../utils/is"
import {CORE_STRATEGIES} from "../../utils/constants"

const stub = () => {
  throw new Error(`Platform specific Core Strategies are not initialized`)
}

const stubCoreStrategies = {
  [CORE_STRATEGIES["EXT/RPC"]]: stub,
  [CORE_STRATEGIES["HTTP/POST"]]: stub,
  [CORE_STRATEGIES["IFRAME/RPC"]]: stub,
  [CORE_STRATEGIES["POP/RPC"]]: stub,
  [CORE_STRATEGIES["TAB/RPC"]]: stub,
  [CORE_STRATEGIES["EXT/RPC"]]: stub,
}

const supportedPlugins = ["ServicePlugin"]
const supportedServicePlugins = ["discovery-service"]

const validateDiscoveryPlugin = (servicePlugin: any) => {
  const {services = [], serviceStrategy} = servicePlugin
  invariant(Array.isArray(services), "Services must be an array")

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

const ServiceRegistry = ({coreStrategies}: {coreStrategies: any}) => {
  let services = new Set()
  let strategies = new Map(Object.entries(coreStrategies))

  const add = (servicePlugin: any) => {
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

  const setServices = (discoveryServices: any) =>
    (services = new Set([...discoveryServices]))

  const getServices = () => [...services]

  const getStrategy = (method: any) => strategies.get(method)

  const getStrategies = () => [...strategies.keys()]

  return Object.freeze({
    add,
    getServices,
    getStrategy,
    getStrategies,
  })
}

const validatePlugins = (plugins: any[]) => {
  let pluginsArray
  invariant(!!plugins, "No plugins supplied")

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

  const add = (plugins: any) => {
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

let serviceRegistry: ReturnType<typeof ServiceRegistry>
const getIsServiceRegistryInitialized = () =>
  typeof serviceRegistry !== "undefined"

export const initServiceRegistry = ({
  coreStrategies,
}: {
  coreStrategies: any
}) => {
  if (getIsServiceRegistryInitialized()) {
    return serviceRegistry
  }
  const _serviceRegistry = ServiceRegistry({coreStrategies})
  serviceRegistry = _serviceRegistry

  return _serviceRegistry
}
export const getServiceRegistry = () => {
  if (!getIsServiceRegistryInitialized()) {
    console.warn(
      "Registry is not initalized, it will be initialized with stub core strategies"
    )

    return initServiceRegistry({coreStrategies: stubCoreStrategies})
  }

  return serviceRegistry
}
export const pluginRegistry = PluginRegistry()
