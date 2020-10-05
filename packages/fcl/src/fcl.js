import "./default-config"
export {config} from "@onflow/config"
export {send} from "./send"
export {serialize} from "./serialize"
export {decode} from "./decode"
export {transaction as tx} from "./transaction"
export {resolve} from "./resolve"
export {events} from "./events"
export {withPrefix, sansPrefix} from "./address"

import {currentUser} from "./current-user"
export {currentUser}

export const authenticate = () => currentUser().authenticate()
export const unauthenticate = () => currentUser().unauthenticate()

// proxy sdk
export {isOk, isBad, why, cadence, cdc} from "@onflow/sdk"
export {
  build,
  pipe,
  transaction,
  script,
  ping,
  getAccount,
  getEvents,
  getLatestBlock,
  getBlockByHeight,
  getBlockById,
  getTransactionStatus,
} from "@onflow/sdk"
export {
  authorizations,
  authorization,
  args,
  arg,
  params,
  param,
  proposer,
  payer,
  limit,
  ref,
} from "@onflow/sdk"

export const VERSION = "0.0.60"
