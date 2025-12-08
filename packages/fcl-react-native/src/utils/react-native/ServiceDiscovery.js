import {useState, useEffect} from "react"
import {getServiceRegistry} from "@onflow/fcl-core"
import {VERSION} from "../../VERSION"

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
      const serviceRegistry = getServiceRegistry()

      const requestBody = {
        fclVersion: VERSION,
        userAgent: "ReactNative",
        supportedStrategies: ["WC/RPC", "DEEPLINK/RPC"],
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

      // Get discovery services from response
      const discoveryServices = await response.json()
      // Get plugin services to merge with Discovery services
      const pluginServices = serviceRegistry.getServices()

      // Merge discovery services + plugin services, deduplicate by UID
      const mergedServices = [...discoveryServices]
      const discoveryUids = new Set(
        discoveryServices.map(s => s.uid).filter(Boolean)
      )
      // Add plugin services that aren't already in discovery services
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
