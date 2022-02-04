import "./default-config"
export {VERSION} from "./VERSION"
export {query} from "./exec/query"
export {mutate} from "./exec/mutate"
export {verifyUserSignatures} from "./exec/verify"
export {serialize} from "./serialize"
export {transaction as tx} from "./transaction"
export {events} from "./events"

import {currentUser} from "./current-user"
export {currentUser}

import {discovery} from "./discovery"
export {discovery}

export const authenticate = (opts = {}) => currentUser().authenticate(opts)
export const unauthenticate = () => currentUser().unauthenticate()
export const reauthenticate = (opts = {}) => {
  currentUser().unauthenticate()
  return currentUser().authenticate(opts)
}
export const signUp = (opts = {}) => currentUser().authenticate(opts)
export const logIn = (opts = {}) => currentUser().authenticate(opts)

export const authz = currentUser().authorization

import * as types from "@onflow/types"
export const t = types

import * as WalletUtils from "./wallet-utils"
export {WalletUtils}

export {TestUtils} from "@onflow/sdk"
export {config} from "@onflow/sdk"
export {send} from "@onflow/sdk"
export {decode} from "@onflow/sdk"
export {account} from "@onflow/sdk"
export {block} from "@onflow/sdk"
export {latestBlock} from "@onflow/sdk"
export {isOk, isBad, why, pipe, build} from "@onflow/sdk"
export {withPrefix, sansPrefix, display} from "@onflow/util-address"
export {template as cadence} from "@onflow/util-template"
export {template as cdc} from "@onflow/util-template"
export {createSignableVoucher} from "@onflow/sdk"
export {voucherIntercept} from "@onflow/sdk"
export {voucherToTxId} from "@onflow/sdk"

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
