import "./default-config"
import "./temp"
export {serialize} from "./serialize"
export {transaction as tx} from "./transaction"
export {events} from "./events"

import {currentUser} from "./current-user"
export {currentUser}

export const authenticate = () => currentUser().authenticate()
export const unauthenticate = () => currentUser().unauthenticate()
export const reauthenticate = () => {
  currentUser().unauthenticate()
  return currentUser().authenticate()
}
export const signUp = () => currentUser().authenticate()
export const logIn = () => currentUser().authenticate()

export const authz = currentUser().authorization

export {config} from "@onflow/config"
export {send} from "@onflow/sdk-send"
export {decode} from "@onflow/sdk-decode"
export {account} from "@onflow/sdk-account"
export {latestBlock} from "@onflow/sdk-latest-block"
export {isOk, isBad, why, pipe} from "@onflow/interaction"
export {withPrefix, sansPrefix, display} from "@onflow/util-address"
export {template as cadence} from "@onflow/util-template"
export {template as cdc} from "@onflow/util-template"

// builders
export {transaction} from "@onflow/sdk-build-transaction"
export {script} from "@onflow/sdk-build-script"
export {ping} from "@onflow/sdk-build-ping"
export {getAccount} from "@onflow/sdk-build-get-account"
export {getEvents} from "@onflow/sdk-build-get-events"
export {getLatestBlock} from "@onflow/sdk-build-get-latest-block"
export {getBlockById} from "@onflow/sdk-build-get-block-by-id"
export {getBlockByHeight} from "@onflow/sdk-build-get-block-by-height"
export {getTransactionStatus} from "@onflow/sdk-build-transaction-status"
export {authorizations, authorization} from "@onflow/sdk-build-authorizations"
export {args, arg} from "@onflow/sdk-build-arguments"
export {proposer} from "@onflow/sdk-build-proposer"
export {payer} from "@onflow/sdk-build-payer"
export {limit} from "@onflow/sdk-build-limit"
export {ref} from "@onflow/sdk-build-ref"
export {params, param} from "@onflow/sdk-build-params"

export const VERSION = "0.0.67-alpha.16"
