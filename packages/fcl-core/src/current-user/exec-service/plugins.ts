import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import {isRequired, isString, isFunc} from "../../utils/is"
import {CORE_STRATEGIES} from "../../utils/constants"
import {
  StreamConnector,
  StreamInfo,
  streamConnectorManager,
} from "./streams/stream-connector-manager"
import {Service, StreamConnection} from "@onflow/typedefs"

interface ServicePlugin {
  f_type: string
  type: string
  name: string
  services: Service[]
  serviceStrategy: ServiceStrategy
  streamConnectors?: {
    [key: string]: StreamConnector
  }
}

interface ServiceStrategy {
  method: string
  exec: Function
}

const supportedPlugins = ["ServicePlugin"]
const supportedServicePlugins = ["discovery-service"]

const validateDiscoveryPlugin = (servicePlugin: ServicePlugin) => {
  const {services, serviceStrategy, streamConnectors} = servicePlugin
  invariant(
    Array.isArray(services) && services.length > 0,
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

  return {
    discoveryServices: services,
    serviceStrategy,
    streamConnectors: streamConnectors || [],
  }
}

const ServiceRegistry = ({
  coreStrategies,
  streamConnectors,
}: {
  coreStrategies: {
    [key: string]: Function
  }
  streamConnectors: {
    [key: string]: (stream: StreamInfo) => Promise<StreamConnection<any>>
  }
}) => {
  let services = new Set()
  let strategies = new Map(Object.entries(coreStrategies))

  // Add all stream connectors
  for (const [type, connect] of Object.entries(streamConnectors)) {
    streamConnectorManager.add(type, connect)
  }

  const setServices = (discoveryServices: Service[]) =>
    (services = new Set([...discoveryServices]))

  const getServices = () => [...services]

  const getStrategy = (method: string) => strategies.get(method)

  const getStrategies = () => [...strategies.keys()]

  const add = (servicePlugin: ServicePlugin) => {
    invariant(
      supportedServicePlugins.includes(servicePlugin.type),
      `Service Plugin type ${servicePlugin.type} is not supported`
    )
    if (servicePlugin.type === "discovery-service") {
      const {discoveryServices, serviceStrategy, streamConnectors} =
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

      // Add all stream connectors from the service plugin
      for (const [type, connect] of Object.entries(streamConnectors)) {
        streamConnectorManager.add(type, connect)
      }
    }
  }

  return Object.freeze({
    getServices,
    getStrategy,
    getStrategies,
    add,
  })
}

const validatePlugins = (plugins: ServicePlugin[]) => {
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

  const add = (plugins: ServicePlugin[]) => {
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
  streamConnectors,
}: {
  coreStrategies: {
    [key: string]: Function
  }
  streamConnectors: {
    [key: string]: (stream: StreamInfo) => Promise<StreamConnection<any>>
  }
}) => {
  if (getIsServiceRegistryInitialized()) {
    return serviceRegistry
  }
  const _serviceRegistry = ServiceRegistry({coreStrategies, streamConnectors})
  serviceRegistry = _serviceRegistry

  return _serviceRegistry
}

export const getServiceRegistry = () => {
  if (!getIsServiceRegistryInitialized()) {
    console.warn(
      "Registry is not initalized, it will be initialized with stub core strategies"
    )

    return initServiceRegistry({
      coreStrategies: {},
      streamConnectors: {},
    })
  }

  return serviceRegistry
}

export const pluginRegistry = PluginRegistry()
