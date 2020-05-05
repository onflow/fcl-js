import "./default-config"
export {config} from "./config"
export {send} from "./send"
export {user} from "./user"

import {currentUser} from "./current-user"
export {currentUser}

export const authenticate = () => currentUser().authenticate()
export const unauthenticate = () => currentUser().unauthenticate()

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
