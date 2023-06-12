export * from './shared-exports';

import {config} from "@onflow/config"
import {execLocal, getDefaultConfig, useServiceDiscovery, ServiceDiscovery} from "./utils/react-native"
import {initServiceRegistry} from "./current-user/exec-service/plugins"

config(getDefaultConfig())

initServiceRegistry({execLocal})

export {useServiceDiscovery, ServiceDiscovery}
