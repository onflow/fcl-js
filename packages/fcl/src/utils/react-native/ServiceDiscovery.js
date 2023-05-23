import { useState, useEffect, createElement } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const fetcher = (url, opts) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opts),
  }).then(d => d.json())
}
const DefaultLoadingComponent = () => createElement(Text, null, "Loading...");
const DefaultEmptyComponent = () => createElement(Text, null, "No Wallets Found");

const DefaultServiceCard = ({
  service,
  onPress
}) => {
  return createElement(
    TouchableOpacity,
    { onPress },
    createElement(Text, null, service?.provider?.name),
  )
}

const DefaultWrapper = ({ children }) => createElement(View, { style: styles.container}, ...children)

export const useServiceDiscovery = ({ fcl }) => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const getServices = async () => {
    setIsLoading(true);
    const endpoint = await fcl.config.get("discovery.authn.endpoint")
    try {
      const response = await fetcher(endpoint, {
        fclVersion: fcl.VERSION,
        userAgent: 'ReactNative',
        supportedStrategies: [
          'HTTP/POST',
        ],
      })
      setServices(response)
      setIsLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getServices()
  }, []);

  const authenticateService = (service) => {
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

// interface IWebBrowserProps {
//   fcl: FCL,
//   Loading: () => JSX.Element,
//   Empty: () => JSX.Element,
//   Wrapper: () => JSX.Element,
//   ServiceCard: ({service, onPress, key}) => JSX.Element,
// }

export const ServiceDiscovery = ({
  fcl, 
  Loading = DefaultLoadingComponent, 
  Empty = DefaultEmptyComponent, 
  ServiceCard = DefaultServiceCard, 
  Wrapper = DefaultWrapper
}) => {
  const { services, isLoading, authenticateService } = useServiceDiscovery({ fcl })

  return createElement(
    Wrapper,
    null, 
    isLoading && createElement(Loading),
    !isLoading && services.length === 0 && createElement(Empty),
    !isLoading && services.map((service, index) => {
      return (
        createElement(ServiceCard, {
          key: service?.provider?.address ?? index,
          service,
          onPress: () => {
            authenticateService(service)
          }
        })
      )})
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
