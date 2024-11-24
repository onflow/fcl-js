export {VERSION} from "./VERSION"
export {query} from "./exec/query"
export {verifyUserSignatures} from "./exec/verify"
export {serialize} from "./serialize"
export {transaction as tx} from "./transaction"
export {events} from "./events"
export {pluginRegistry} from "./current-user/exec-service/plugins"

import {discovery} from "./discovery"
export {discovery}

import * as types from "@onflow/types"
export {types as t}

import * as WalletUtils from "./wallet-utils"
export {WalletUtils}

import * as AppUtils from "./app-utils"
export {AppUtils}

import * as InteractionTemplateUtils from "./interaction-template-utils"
export {InteractionTemplateUtils}

export {getChainId} from "./utils"

export {TestUtils} from "@onflow/sdk"

import {config} from "@onflow/config"
export {config}

export {send} from "@onflow/sdk"
export {decode} from "@onflow/sdk"
export {account} from "@onflow/sdk"
export {block} from "@onflow/sdk"
export {nodeVersionInfo} from "@onflow/sdk"
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
export {getBlock} from "@onflow/sdk"
export {getBlockHeader} from "@onflow/sdk"
export {getCollection} from "@onflow/sdk"
export {getTransactionStatus} from "@onflow/sdk"
export {getTransaction} from "@onflow/sdk"
export {getNetworkParameters} from "@onflow/sdk"
export {getNodeVersionInfo} from "@onflow/sdk"
export {authorizations, authorization} from "@onflow/sdk"
export {subscribeEvents} from "@onflow/sdk"
export {args, arg} from "@onflow/sdk"
export {proposer} from "@onflow/sdk"
export {payer} from "@onflow/sdk"
export {limit} from "@onflow/sdk"
export {ref} from "@onflow/sdk"
export {params, param} from "@onflow/sdk"
export {validator} from "@onflow/sdk"
export {invariant} from "@onflow/sdk"

/**
 * @typedef {object} Types
 * @property {any} Identity - Represents the Identity type.
 * @property {any} UInt - Represents the UInt type.
 * @property {any} Int - Represents the Int type.
 * @property {any} UInt8 - Represents the UInt8 type.
 * @property {any} Int8 - Represents the Int8 type.
 * @property {any} UInt16 - Represents the UInt16 type.
 * @property {any} Int16 - Represents the Int16 type.
 * @property {any} UInt32 - Represents the UInt32 type.
 * @property {any} Int32 - Represents the Int32 type.
 * @property {any} UInt64 - Represents the UInt64 type.
 * @property {any} Int64 - Represents the Int64 type.
 * @property {any} UInt128 - Represents the UInt128 type.
 * @property {any} Int128 - Represents the Int128 type.
 * @property {any} UInt256 - Represents the UInt256 type.
 * @property {any} Int256 - Represents the Int256 type.
 * @property {any} Word8 - Represents the Word8 type.
 * @property {any} Word16 - Represents the Word16 type.
 * @property {any} Word32 - Represents the Word32 type.
 * @property {any} Word64 - Represents the Word64 type.
 * @property {any} UFix64 - Represents the UFix64 type.
 * @property {any} Fix64 - Represents the Fix64 type.
 * @property {any} String - Represents the String type.
 * @property {any} Character - Represents the Character type.
 * @property {any} Bool - Represents the Bool type.
 * @property {any} Address - Represents the Address type.
 * @property {any} Void - Represents the Void type.
 * @property {any} Optional - Represents the Optional type.
 * @property {any} Reference - Represents the Reference type.
 * @property {any} Array - Represents the Array type.
 * @property {any} Dictionary - Represents the Dictionary type.
 * @property {any} Event - Represents the Event type.
 * @property {any} Resource - Represents the Resource type.
 * @property {any} Struct - Represents the Struct type.
 * @property {any} Enum - Represents the Enum type.
 * @property {any} Path - Represents the Path type.
 */

/**
 * @callback ArgsFn
 * @param {ArgFn} arg - Argument function to define a single argument
 * @param {Types} t - Cadence Types object used to define the type
 * @returns {any[]}
 */

/**
 * @callback ArgFn
 * @param {any} value - the value of the argument
 * @param {any} type - the cadence type of the value
 * @returns {any}
 */

import {watchForChainIdChanges} from "./utils"

// Set chain id default on access node change
watchForChainIdChanges()

export {getMutate} from "./exec/mutate"

export {getCurrentUser} from "./current-user"

export {initServiceRegistry} from "./current-user/exec-service/plugins"

export {isReactNative, setIsReactNative} from "./utils/is-react-native"

export {getExecHttpPost} from "./current-user/exec-service/strategies/http-post"

export {normalizePollingResponse} from "./normalizers/service/polling-response"
export {buildMessageHandler} from "./current-user/exec-service/strategies/utils/buildMessageHandler"
export {serviceEndpoint} from "./current-user/exec-service/strategies/utils/service-endpoint"
export {URL} from "./utils/url"
export {
  CORE_STRATEGIES,
  FCL_REDIRECT_URL_PARAM_NAME,
  FCL_RESPONSE_PARAM_NAME,
} from "./utils/constants"

export {execStrategy} from "./current-user/exec-service"

export type {StorageProvider} from "./utils/storage"
