export * from './shared-exports';

import {config} from "@onflow/config"
import {getDefaultConfig, coreStrategies} from "./utils/web"
import {initServiceRegistry} from "./current-user/exec-service/plugins"

config(getDefaultConfig())

initServiceRegistry({coreStrategies})
