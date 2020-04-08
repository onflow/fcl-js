import "./default-config"
export {config} from "./config"
export {send} from "./send"
export {user} from "./user"

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
