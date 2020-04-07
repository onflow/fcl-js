import "./default-config"
import * as sdk from "@onflow/sdk"
import {encode} from "@onflow/resolver-encode"
import {send as baseSend} from "@onflow/send"
export {config} from "./config"

export const authenticate = async () => {}
export const unauthenticate = async () => {}

export const currentUser = () => {
  return {
    subscribe: callback => {
      return function unsubscribe() {}
    },

    authorization: async () => {},
    payerAuthorization: async () => {},
    param: async () => {},
  }
}

export const user = flowAcctNumber => {
  return {
    subscribe: callback => {
      return function unsubscribe() {}
    },

    authorization: async () => {},
    payerAuthorization: async () => {},
    param: async () => {},
  }
}

export const transaction = txId => {
  return {
    subscribe: callback => {
      return function unsubscribe() {}
    },
  }
}

export const event = (eventType, start) => {
  return {
    subscribe: callback => {
      return function unsubscribe() {}
    },
  }
}

export const decode = async _respones => {}

export const send = (args = [], opts = {}) => {
  opts.node = opts.node || NODE

  if (Array.isArray(args)) args = sdk.build(args)

  return sdk.pipe(args, [
    sdk.resolve([sdk.resolveParams, encode, sdk.resolveSignatures]),
    ix => baseSend(ix, opts),
  ])
}
