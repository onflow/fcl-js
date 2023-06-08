export * from './shared-exports';

import {config} from "@onflow/config"
import {getDefaultConfig, execLocal} from "./utils/web"
import {initServiceRegistry} from "./current-user/exec-service/plugins"

config(getDefaultConfig())

initServiceRegistry({execLocal})
