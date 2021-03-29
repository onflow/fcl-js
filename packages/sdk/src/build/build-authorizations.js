import {pipe, makeAuthorizer} from "../interaction/interaction.js"

const roles = {
  authorizer: true,
}

export function authorizations(ax = []) {
  return pipe(
    ax.map((authz) => {
      return typeof authz === "function"
        ? makeAuthorizer({resolve: authz, role: roles, roles})
        : makeAuthorizer({...authz, role: roles, roles})
    })
  )
}

export function authorization(addr, signingFunction, keyId, sequenceNum) {
  return {addr, signingFunction, keyId, sequenceNum}
}
