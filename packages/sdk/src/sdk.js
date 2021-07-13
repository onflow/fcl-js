import {deprecate} from "./utils"
// Base
export {build} from "./build/build.js"
export {resolve} from "./resolve/resolve.js"
export {send} from "./send/send.js"
export {decode} from "./decode/sdk-decode.js"

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
} from "./interaction/interaction.js"
export {createSignableVoucher} from "./resolve/resolve-signatures"
export {encodeMessageFromSignable} from "./wallet-utils/encode-signable.js"
export {template as cadence} from "@onflow/util-template"
export {template as cdc} from "@onflow/util-template"

// Helpers
export {latestBlock} from "./latest-block/latest-block.js"
export {account} from "./account/account.js"

// Builders
export {authorizations, authorization} from "./build/build-authorizations.js"
export {atBlockHeight} from "./build/build-at-block-height.js"
export {atBlockId} from "./build/build-at-block-id.js"
export {getAccount} from "./build/build-get-account.js"
export {getEvents} from "./build/build-get-events.js"
export {getEventsAtBlockHeightRange} from "./build/build-get-events-at-block-height-range.js"
export {getEventsAtBlockIds} from "./build/build-get-events-at-block-ids"
export {getBlock} from "./build/build-get-block.js"
export {getBlockHeader} from "./build/build-get-block-header.js"
export {getLatestBlock} from "./build/build-get-latest-block.js"
export {getBlockById} from "./build/build-get-block-by-id.js"
export {getBlockByHeight} from "./build/build-get-block-by-height"
export {getCollection} from "./build/build-get-collection"
export {getTransactionStatus} from "./build/build-get-transaction-status.js"
export {getTransaction} from "./build/build-get-transaction.js"
export {limit} from "./build/build-limit.js"
export {args, arg} from "./build/build-arguments.js"
export {proposer} from "./build/build-proposer.js"
export {payer} from "./build/build-payer.js"
export {ping} from "./build/build-ping.js"
export {ref} from "./build/build-ref.js"
export {script} from "./build/build-script.js"
export {transaction} from "./build/build-transaction.js"
export {validator} from "./build/build-validator.js"
export {invariant} from "./build/build-invariant.js"

// Resolvers
export {resolveCadence} from "./resolve/resolve-cadence.js"
export {resolveFinalNormalization} from "./resolve/resolve-final-normalization"
export {resolveProposerSequenceNumber} from "./resolve/resolve-proposer-sequence-number"
export {resolveArguments} from "./resolve/resolve-arguments.js"
export {resolveAccounts} from "./resolve/resolve-accounts.js"
export {resolveSignatures} from "./resolve/resolve-signatures.js"
export {resolveValidators} from "./resolve/resolve-validators.js"
export {resolveRefBlockId} from "./resolve/resolve-ref-block-id.js"

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

import * as TestUtils from "./test-utils"
export {TestUtils}

export {VERSION} from "./VERSION"
