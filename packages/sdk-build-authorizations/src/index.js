import {pipe, makeAuthorizer} from "@onflow/interaction"

const roles = {
  authorizer: true
}

export function authorizations(ax = []) {
  return pipe(ax.map(authz => {
    return typeof authz === "function"
      ? makeAuthorization({ resolve: authz, role: roles, roles })
      : makeAuthorization({ ...authz, role: roles, roles })
  }))
}

export function authorization(addr, signingFunction, keyId, sequenceNum) {
  return {addr, signingFunction, keyId, sequenceNum}
}
