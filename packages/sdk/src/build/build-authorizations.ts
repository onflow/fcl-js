import {pipe, prepAccount, AUTHORIZER} from "../interaction/interaction.js"

export function authorizations(ax = []) {
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {role: AUTHORIZER})
    })
  )
}

export function authorization(addr, signingFunction, keyId, sequenceNum) {
  return {addr, signingFunction, keyId, sequenceNum}
}
