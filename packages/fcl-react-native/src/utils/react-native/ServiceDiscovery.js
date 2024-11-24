import {useState, useEffect, createElement} from "react"
import {StyleSheet, Text, View, TouchableOpacity} from "react-native"

/**
 * @typedef {import("@onflow/typedefs").Service} Service
 */

/**
 * Fetches data from a URL using the POST method and returns the parsed JSON response.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} opts - Additional options for the fetch request.
 * @returns {Promise<object>} - A promise that resolves to the parsed JSON response.
 */
const fetcher = (url, opts) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opts),
  }).then(d => d.json())
}

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
    {onPress},
    createElement(Text, null, service?.provider?.name)
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
  createElement(View, {style: styles.container}, ...children)

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
      const response = await fetcher(endpoint, {
        fclVersion: fcl.VERSION,
        userAgent: "ReactNative",
        supportedStrategies: ["HTTP/POST"],
      })
      setServices(response)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
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
 * @returns {JSX.Element} - The service discovery component.
 */
export const ServiceDiscovery = ({
  fcl,
  Loading = DefaultLoadingComponent,
  Empty = DefaultEmptyComponent,
  ServiceCard = DefaultServiceCard,
  Wrapper = DefaultWrapper,
}) => {
  const {services, isLoading, authenticateService} = useServiceDiscovery({fcl})

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
            authenticateService(service)
          },
        })
      })
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
