import { useState, useEffect, createElement } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { authenticate } from '../../../../fcl';
import { VERSION } from '../../../../VERSION';

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

// interface IWebBrowserProps {
//   discoveryApi: string,
//   Loading: () => JSX.Element,
//   Empty: () => JSX.Element,
//   Wrapper: () => JSX.Element,
//   ServiceCard: ({service, onPress, key}) => JSX.Element,
// }

export const ServiceDiscovery = ({
  discoveryApi, 
  Loading = DefaultLoadingComponent, 
  Empty = DefaultEmptyComponent, 
  ServiceCard = DefaultServiceCard, 
  Wrapper = DefaultWrapper
}) => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetcher(discoveryApi, {
        fclVersion: VERSION,
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
            authenticate({service})
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
