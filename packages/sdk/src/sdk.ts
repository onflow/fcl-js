import * as logger from "@onflow/util-logger"
// Base
export {build} from "./build/build"
export {resolve} from "./resolve/resolve"
export {send} from "./send/send"
export {decode} from "./decode/sdk-decode"
export {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
  encodeTxIdFromVoucher,
} from "./encode/encode"
// Utils
export {
  interaction,
  isOk,
  isBad,
  why,
  pipe,
  get,
  put,
  update,
  destroy,
  isUnknown,
  isScript,
  isTransaction,
  isGetTransaction,
  isGetTransactionStatus,
  isGetAccount,
  isGetEvents,
  isPing,
  isGetBlock,
  isGetBlockHeader,
  isGetCollection,
} from "./interaction/interaction"
export {createSignableVoucher, voucherToTxId} from "./resolve/voucher"
export {encodeMessageFromSignable} from "./wallet-utils/encode-signable"
export {template as cadence} from "@onflow/util-template"
export {template as cdc} from "@onflow/util-template"

// Helpers
export {account} from "./account/account"
export {block} from "./block/block"

// Builders
export {authorizations, authorization} from "./build/build-authorizations"
export {atBlockHeight} from "./build/build-at-block-height"
export {atBlockId} from "./build/build-at-block-id"
export {getAccount} from "./build/build-get-account"
export {getEvents} from "./build/build-get-events"
export {getEventsAtBlockHeightRange} from "./build/build-get-events-at-block-height-range"
export {getEventsAtBlockIds} from "./build/build-get-events-at-block-ids"
export {getBlock} from "./build/build-get-block"
export {getBlockHeader} from "./build/build-get-block-header"
export {getCollection} from "./build/build-get-collection"
export {getTransactionStatus} from "./build/build-get-transaction-status"
export {getTransaction} from "./build/build-get-transaction"
export {limit} from "./build/build-limit"
export {args, arg} from "./build/build-arguments"
export {proposer} from "./build/build-proposer"
export {payer} from "./build/build-payer"
export {ping} from "./build/build-ping"
export {ref} from "./build/build-ref"
export {script} from "./build/build-script"
export {transaction} from "./build/build-transaction"
export {validator} from "./build/build-validator"
export {invariant} from "./build/build-invariant"
export {voucherIntercept} from "./build/build-voucher-intercept"

// Resolvers
export {resolveCadence} from "./resolve/resolve-cadence"
export {resolveFinalNormalization} from "./resolve/resolve-final-normalization"
export {resolveProposerSequenceNumber} from "./resolve/resolve-proposer-sequence-number"
export {resolveArguments} from "./resolve/resolve-arguments"
export {resolveAccounts} from "./resolve/resolve-accounts"
export {resolveSignatures} from "./resolve/resolve-signatures"
export {resolveValidators} from "./resolve/resolve-validators"
export {resolveRefBlockId} from "./resolve/resolve-ref-block-id"
export {resolveVoucherIntercept} from "./resolve/resolve-voucher-intercept"

export {config} from "@onflow/config"

// Deprecated
export const params = params =>
  logger.log.deprecate({
    pkg: "FCL/SDK",
    message: `The params builder has been removed from the Flow JS-SDK/FCL.`,
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params",
    level: logger.LEVELS.error,
  })
export const param = params =>
  logger.log.deprecate({
    pkg: "FCL/SDK",
    message: `The param builder has been removed from the Flow JS-SDK/FCL.`,
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params",
    level: logger.LEVELS.error,
  })

import * as TestUtils from "./test-utils"
export {TestUtils}

export {VERSION} from "./VERSION"
