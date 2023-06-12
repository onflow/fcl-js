export * from './shared-exports';

import {config} from "@onflow/config"
import {execLocal, getDefaultConfig, useServiceDiscovery, ServiceDiscovery} from "./utils/react-native"
import {initServiceRegistry} from "./current-user/exec-service/plugins"
import { initStrategyUtils } from './current-user/exec-service/strategies/utils/react-native';

config(getDefaultConfig())

initServiceRegistry({execLocal})
initStrategyUtils()

export {useServiceDiscovery, ServiceDiscovery}
