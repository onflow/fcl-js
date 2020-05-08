import {pipe, makeAuthorizer} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export function authorizations(ax = []) {
  return pipe(
    ax.map(authorization => {
      const a = isFn(authorization)
        ? { resolve: authorization }
        : authorization
    
      return makeAuthorizer({ ...a, role: { authorizer: true }})
    }
  ))
}

export function authorization(addr, signingFunction, keyId, sequenceNum) {
  return {addr, signingFunction, keyId, sequenceNum}
}
