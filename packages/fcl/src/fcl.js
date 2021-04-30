import "./default-config"
import "./temp"
export {VERSION} from "./VERSION"
export {query} from "./exec/query"
export {serialize} from "./serialize"
export {transaction as tx} from "./transaction"
export {events} from "./events"

import {currentUser} from "./current-user"
export {currentUser}

export const authenticate = opts => currentUser().authenticate(opts)
export const unauthenticate = () => currentUser().unauthenticate()
export const reauthenticate = () => {
  currentUser().unauthenticate()
  return currentUser().authenticate()
}
export const signUp = () => currentUser().authenticate()
export const logIn = () => currentUser().authenticate()

export const authz = currentUser().authorization

export const sign = currentUser().sign

import * as types from "@onflow/types"
export const t = types

export {config} from "@onflow/config"
export {send} from "@onflow/sdk"
export {decode} from "@onflow/sdk"
export {account} from "@onflow/sdk"
export {latestBlock} from "@onflow/sdk"
export {isOk, isBad, why, pipe, build} from "@onflow/sdk"
export {withPrefix, sansPrefix, display} from "@onflow/util-address"
export {template as cadence} from "@onflow/util-template"
export {template as cdc} from "@onflow/util-template"

// builders
export {transaction} from "@onflow/sdk"
export {script} from "@onflow/sdk"
export {ping} from "@onflow/sdk"
export {atBlockHeight} from "@onflow/sdk"
export {atBlockId} from "@onflow/sdk"
export {getAccount} from "@onflow/sdk"
export {getEvents} from "@onflow/sdk"
export {getEventsAtBlockHeightRange} from "@onflow/sdk"
export {getEventsAtBlockIds} from "@onflow/sdk"
export {getLatestBlock} from "@onflow/sdk"
export {getBlock} from "@onflow/sdk"
export {getBlockHeader} from "@onflow/sdk"
export {getBlockById} from "@onflow/sdk"
export {getBlockByHeight} from "@onflow/sdk"
export {getCollection} from "@onflow/sdk"
export {getTransactionStatus} from "@onflow/sdk"
export {getTransaction} from "@onflow/sdk"
export {authorizations, authorization} from "@onflow/sdk"
export {args, arg} from "@onflow/sdk"
export {proposer} from "@onflow/sdk"
export {payer} from "@onflow/sdk"
export {limit} from "@onflow/sdk"
export {ref} from "@onflow/sdk"
export {params, param} from "@onflow/sdk"
export {validator} from "@onflow/sdk"
export {invariant} from "@onflow/sdk"
