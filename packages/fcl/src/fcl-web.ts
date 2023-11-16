export * from "@onflow/fcl-core"

import {getMutate, getCurrentUser, initServiceRegistry } from "@onflow/fcl-core"

export const mutate = getMutate({platform: "web"})

const currentUser = getCurrentUser({platform: "web"})

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

config(getDefaultConfig())

initServiceRegistry({coreStrategies})
