import "./default-config"
export {config} from "./config"
export {send} from "./send"
export {decode} from "./decode"
export {transaction as tx} from "./transaction"

import {currentUser} from "./current-user"
export {currentUser}

export const authenticate = () => currentUser().authenticate()
export const unauthenticate = () => currentUser().unauthenticate()

// proxy sdk
export {isOk, isBad, why} from "@onflow/sdk"
export {
  transaction,
  script,
  ping,
  getAccount,
  getEvents,
  getLatestBlock,
  getTransactionStatus,
} from "@onflow/sdk"
export {
  authorizations,
  authorization,
  params,
  param,
  proposer,
  payer,
  limit,
  ref,
} from "@onflow/sdk"
