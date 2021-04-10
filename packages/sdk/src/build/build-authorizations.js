import {pipe, makeAccountRole} from "../interaction/interaction.js"

const roles = {
  authorizer: true,
}

export function authorizations(ax = []) {
  return pipe(
    ax.map(authz => {
      return typeof authz === "function"
        ? makeAccountRole({resolve: authz, role: roles})
        : makeAccountRole({...authz, role: roles})
    })
  )
}

export function authorization(addr, signingFunction, keyId, sequenceNum) {
  return {addr, signingFunction, keyId, sequenceNum}
}
