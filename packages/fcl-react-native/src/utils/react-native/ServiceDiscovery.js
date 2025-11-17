import {useState, useEffect, createElement} from "react"
import {StyleSheet, Text, View, TouchableOpacity} from "react-native"
import {getServiceRegistry, URL} from "@onflow/fcl-core"

/**
 * @typedef {import("@onflow/typedefs").Service} Service
 */

/**
 * Default loading component that renders the "Loading..." text.
 *
 * @returns {JSX.Element} - The loading component.
 */
const DefaultLoadingComponent = () => createElement(Text, null, "Loading...")

/**
 * Default empty component that renders the "No Wallets Found" text.
 *
 * @returns {JSX.Element} - The empty component.
 */
const DefaultEmptyComponent = () =>
  createElement(Text, null, "No Wallets Found")

/**
 * Default service card component that renders a TouchableOpacity with the service provider's name as text.
 *
 * @param {object} props - The component props.
 * @param {Service} props.service - The service object.
 * @param {Function} props.onPress - The onPress event handler.
 * @returns {JSX.Element} - The service card component.
 */
const DefaultServiceCard = ({service, onPress}) => {
  return createElement(
    TouchableOpacity,
    {
      onPress,
      style: {
        backgroundColor: "#0052FF",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        minHeight: 60,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    },
    createElement(
      Text,
      {
        style: {
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
        },
      },
      service?.provider?.name
    )
  )
}

/**
 * Default wrapper component that renders a View with the specified style and children components.
 *
 * @param {object} props - The component props.
 * @param {JSX.Element[]} props.children - The children components.
 * @returns {JSX.Element} - The wrapper component.
 */
const DefaultWrapper = ({children}) =>
  createElement(View, {style: getStyles().container}, ...children)

/**
 * Custom hook for service discovery.
 *
 * @param {object} params - The hook parameters.
 * @param {object} params.fcl - The fcl instance.
 * @returns {object} - The service discovery result object.
 * @property {object[]} services - The discovered services.
 * @property {boolean} isLoading - A flag indicating whether the services are being loaded.
 * @property {Function} authenticateService - A function to authenticate a service.
 */
export const useServiceDiscovery = ({fcl}) => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getServices = async () => {
    setIsLoading(true)
    console.log(
      "Discovery: Replicating FCL's getServices() logic for React Native"
    )

    // NOTE: fcl-discovery.onflow.org currently returns 404 for React Native requests
    // This is a server-side issue - the Vercel deployment blocks React Native/OkHttp
    // The same requests work perfectly from curl and browsers
    // See: FCL_DISCOVERY_BUG_REPORT.md in the repository root
    // Workaround: Manually add wallets via the plugin system (wallets array in config)

    try {
      // Replicate what fcl-core/src/discovery/services.ts getServices() does
      const endpoint = await fcl.config.get("discovery.authn.endpoint")
      if (!endpoint) {
        throw new Error('"discovery.authn.endpoint" in config must be defined.')
      }

      const include = await fcl.config.get("discovery.authn.include", [])
      const exclude = await fcl.config.get("discovery.authn.exclude", [])

      // Use FCL's URL class to fix React Native trailing slash bug
      const url = new URL(endpoint)
      console.log("Discovery: Endpoint URL:", url.href)

      // Get network from config (getChainId equivalent)
      const network = await fcl.config.get("flow.network", "testnet")

      // Get client services (plugin services) - React Native doesn't have window.fcl_extensions
      // so we just get services from the service registry
      const serviceRegistry = getServiceRegistry()
      const clientServices = serviceRegistry.getServices()
      console.log(
        "Discovery: Client services (plugins):",
        clientServices.length
      )

      // Get supported strategies from service registry
      const supportedStrategies = serviceRegistry.getStrategies()
      console.log("Discovery: Supported strategies:", supportedStrategies)

      // Build request body exactly like services.ts does
      // NOTE: Changed userAgent to look like browser - server might be filtering "ReactNative"
      const requestBody = {
        type: ["authn"],
        fclVersion: fcl.VERSION,
        include,
        exclude,
        features: {
          suggested: await fcl.config.get("discovery.features.suggested", []),
        },
        clientServices,
        supportedStrategies,
        userAgent: "Mozilla/5.0 (compatible; FCL/1.0)",
        network,
      }

      console.log(
        "Discovery: Request body:",
        JSON.stringify(requestBody, null, 2)
      )

      // Make the fetch request exactly like services.ts does
      const response = await fetch(url.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Discovery: Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const discoveryServices = await response.json()
      console.log("Discovery: Services returned:", discoveryServices.length)
      console.log(
        "Discovery: Service names:",
        discoveryServices.map(s => s.provider?.name || s.uid)
      )

      setServices(discoveryServices)
      setIsLoading(false)
    } catch (error) {
      console.log("Service Discovery Error - Failed:", error.message || error)

      // Fallback: try to get plugin services directly
      try {
        const serviceRegistry = getServiceRegistry()
        if (serviceRegistry) {
          const pluginServices = serviceRegistry.getServices()
          console.log(
            "Discovery: Falling back to plugin services only:",
            pluginServices.length
          )
          setServices(pluginServices)
        } else {
          setServices([])
        }
      } catch (pluginError) {
        console.log(
          "Discovery: Failed to get plugin services too:",
          pluginError.message
        )
        setServices([])
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getServices()
  }, [])

  /**
   * Authenticates the provided service using the fcl instance.
   *
   * @param {object} service - The service object to authenticate.
   */
  const authenticateService = service => {
    if (services.includes(service)) {
      fcl.authenticate({service})
    }
  }

  return {
    services,
    isLoading,
    authenticateService,
  }
}

/**
 * Component for service discovery.
 *
 * @param {object} props - The component props.
 * @param {object} props.fcl - The fcl instance.
 * @param {Function} [props.Loading=DefaultLoadingComponent] - The loading component.
 * @param {Function} [props.Empty=DefaultEmptyComponent] - The empty component.
 * @param {Function} [props.ServiceCard=DefaultServiceCard] - The service card component.
 * @param {Function} [props.Wrapper=DefaultWrapper] - The wrapper component.
 * @param {Function} [props.onServiceSelect] - Optional custom handler for service selection. If provided, this will be called instead of the default authentication.
 * @returns {JSX.Element} - The service discovery component.
 */
export const ServiceDiscovery = ({
  fcl,
  Loading = DefaultLoadingComponent,
  Empty = DefaultEmptyComponent,
  ServiceCard = DefaultServiceCard,
  Wrapper = DefaultWrapper,
  onServiceSelect,
}) => {
  const {services, isLoading, authenticateService} = useServiceDiscovery({fcl})

  const handleServicePress = service => {
    if (onServiceSelect) {
      onServiceSelect(service)
    } else {
      authenticateService(service)
    }
  }

  return createElement(
    Wrapper,
    null,
    isLoading && createElement(Loading),
    !isLoading && services.length === 0 && createElement(Empty),
    !isLoading &&
      services.map((service, index) => {
        return createElement(ServiceCard, {
          key: service?.provider?.address ?? index,
          service,
          onPress: () => {
            handleServicePress(service)
          },
        })
      })
  )
}

// Lazy create styles to avoid calling StyleSheet.create at module load time
// This prevents TurboModule errors in Expo Go
let styles
const getStyles = () => {
  if (!styles) {
    styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
    })
  }
  return styles
}
