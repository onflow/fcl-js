export * from "@onflow/fcl-core"

import {getMutate, getCurrentUser, initServiceRegistry, setIsReactNative} from "@onflow/fcl-core"
export const mutate = getMutate({platform: "react-native"})

const currentUser = getCurrentUser({platform: "react-native"})

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
import {
  coreStrategies,
  getDefaultConfig,
  useServiceDiscovery,
  ServiceDiscovery,
} from "./utils/react-native"

config(getDefaultConfig())

// Set chain id default on access node change
initServiceRegistry({coreStrategies})

// Set isReactNative flag
setIsReactNative(true)

export {useServiceDiscovery, ServiceDiscovery}