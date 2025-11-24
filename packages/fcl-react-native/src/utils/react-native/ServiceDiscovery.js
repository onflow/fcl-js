import {useState, useEffect, createElement} from "react"
import {StyleSheet, Text, View, TouchableOpacity} from "react-native"
import {getServiceRegistry} from "@onflow/fcl-core"
import {VERSION} from "../../VERSION"

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
    const endpoint = await fcl.config.get("discovery.authn.endpoint")

    try {
      // Get supported strategies from service registry (should be WC/RPC for React Native)
      const serviceRegistry = getServiceRegistry()
      const supportedStrategies = serviceRegistry.getStrategies()

      const requestBody = {
        fclVersion: VERSION,
        userAgent: "ReactNative",
        supportedStrategies,
      }

      // Fetch wallets from Discovery API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const discoveryServices = await response.json()

      // Filter to only mobile-compatible strategies (WC/RPC, DEEPLINK/RPC)
      const mobileStrategies = ["WC/RPC", "DEEPLINK/RPC"]
      const mobileServices = discoveryServices.filter(s =>
        mobileStrategies.includes(s.method)
      )

      // Get plugin services to merge with Discovery services
      const pluginServices = serviceRegistry.getServices()

      // Merge mobile Discovery services + plugin services, deduplicate by UID
      const mergedServices = [...mobileServices]
      const discoveryUids = new Set(
        mobileServices.map(s => s.uid).filter(Boolean)
      )
      // Add plugin services that aren't already in Discovery
      for (const pluginService of pluginServices) {
        if (!discoveryUids.has(pluginService.uid)) {
          mergedServices.push(pluginService)
        }
      }

      setServices(mergedServices)
      setIsLoading(false)
    } catch (error) {
      // Fallback: use plugin services only
      try {
        const serviceRegistry = getServiceRegistry()
        const fallbackServices = serviceRegistry.getServices()
        setServices(fallbackServices)
      } catch (pluginError) {
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
