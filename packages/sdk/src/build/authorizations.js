import {pipe, makeAuthorizer} from "@onflow/interaction"

export function authorizations(ax = []) {
  return pipe([
    ...ax.map(a =>
      makeAuthorizer(
        {
          ...a,
          role: {authorizer: true},
        }
      )
    ),
  ])
}

export function authorization(addr, signingFunction, keyId) {
  return {addr, signingFunction, keyId}
}
