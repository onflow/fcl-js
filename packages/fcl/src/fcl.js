import "./default-config"
export {config} from "./config"
export {send} from "./send"
export {decode} from "./decode"

import {currentUser} from "./current-user"
export {currentUser}

export const authenticate = () => currentUser().authenticate()
export const unauthenticate = () => currentUser().unauthenticate()
