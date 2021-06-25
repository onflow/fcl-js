import {deprecate} from "./utils"
// Base
export {build} from "./build/build"
export {resolve} from "./resolve/resolve"
export {send} from "./send/send"
export {decode} from "./decode/sdk-decode"

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
  isGetLatestBlock,
  isGetBlockById,
  isGetBlockByHeight,
  isPing,
  isGetBlock,
  isGetBlockHeader,
  isGetCollection,
} from "./interaction/interaction"
export {createSignableVoucher} from "./resolve/resolve-signatures"
export {encodeMessageFromSignable} from "./wallet-utils/encode-signable"
export {template as cadence} from "@onflow/util-template"
export {template as cdc} from "@onflow/util-template"

// Helpers
export {latestBlock} from "./latest-block/latest-block"
export {account} from "./account/account"

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
export {getLatestBlock} from "./build/build-get-latest-block"
export {getBlockById} from "./build/build-get-block-by-id"
export {getBlockByHeight} from "./build/build-get-block-by-height"
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

// Resolvers
export {resolveCadence} from "./resolve/resolve-cadence"
export {resolveFinalNormalization} from "./resolve/resolve-final-normalization"
export {resolveProposerSequenceNumber} from "./resolve/resolve-proposer-sequence-number"
export {resolveArguments} from "./resolve/resolve-arguments"
export {resolveAccounts} from "./resolve/resolve-accounts"
export {resolveSignatures} from "./resolve/resolve-signatures"
export {resolveValidators} from "./resolve/resolve-validators"
export {resolveRefBlockId} from "./resolve/resolve-ref-block-id"

// Config
export {config} from "./config"

// Deprecated
export const params = params =>
  deprecate.error({
    name: "params",
    transitionsPath:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params",
  })
export const param = params =>
  deprecate.warn({
    name: "param",
    transitionsPath:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params",
  })

export {VERSION} from "./VERSION"
