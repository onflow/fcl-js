export * from './shared-exports';

import {getMutate} from "./exec/mutate"
export const mutate = getMutate({platform: "web"})

import {getCurrentUser} from "./current-user"
const currentUser = getCurrentUser({platform:"web"})

export {currentUser}

export const authenticate = (opts = {}) => currentUser().authenticate(opts)
export const unauthenticate = () => currentUser().unauthenticate()
export const reauthenticate = (opts = {}) => {
  currentUser().unauthenticate()
  return currentUser().authenticate(opts)
}
export const signUp = (opts = {}) => currentUser().authenticate(opts)
export const logIn = (opts = {}) => currentUser().authenticate(opts)

export const authz = currentUser().authorization

import {config} from "@onflow/config"
import {getDefaultConfig, coreStrategies} from "./utils/web"
import {initServiceRegistry} from "./current-user/exec-service/plugins"

config(getDefaultConfig())

initServiceRegistry({coreStrategies})
