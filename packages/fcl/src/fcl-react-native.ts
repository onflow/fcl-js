export * from './shared-exports';

import {config} from "@onflow/config"
import {execLocal, getDefaultConfig, useServiceDiscovery, ServiceDiscovery} from "./utils/react-native"
import {initServiceRegistry} from "./current-user/exec-service/plugins"
import {setIsReactNative} from './utils/is-react-native';

config(getDefaultConfig())

// Set chain id default on access node change
initServiceRegistry({execLocal})

// Set isReactNative flag
setIsReactNative(true)

export {useServiceDiscovery, ServiceDiscovery}
