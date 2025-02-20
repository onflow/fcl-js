import {CurrentUser, Service} from "@onflow/typedefs"
import * as fcl from "@onflow/fcl"

export function scopedFclUser(
  user: typeof fcl.currentUser,
  service: Service
): ReturnType<typeof fcl.currentUser> {
  function scoped(state: CurrentUser): CurrentUser {
    const authnService = state?.services.find(
      service => service.type === "authn"
    )
    const isMatchingService =
      authnService?.uid && authnService?.uid === service.uid

    return isMatchingService
      ? state
      : {
          f_vsn: "1.0.0",
          f_type: "CurrentUser",
          loggedIn: false,
          services: [],
          addr: undefined,
          cid: undefined,
        }
  }

  return {
    async authenticate() {
      return await user.authenticate({service})
    },
    unauthenticate() {
      return user.unauthenticate()
    },
    subscribe(callback: Function) {
      return user.subscribe((state: CurrentUser) => {
        const scopedState = scoped(state)
        if (scopedState) {
          callback(scopedState)
        }
      })
    },
    // TODO: should these check whether the scope is active?
    async snapshot() {
      return scoped(await user.snapshot())
    },
    signUserMessage: user.signUserMessage.bind(user),
    resolveArgument: user.resolveArgument.bind(user),
    authorization: user.authorization.bind(user),
  }
}
