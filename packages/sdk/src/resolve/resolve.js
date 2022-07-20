import {pipe, isTransaction} from "../interaction/interaction.js"
import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {Buffer} from "@onflow/rlp"
import {send as defaultSend} from "@onflow/transport-http"
import * as ixModule from "../interaction/interaction.js"
import {response} from "../response/response.js"
import {build} from "../build/build.js"
import {getBlock} from "../build/build-get-block.js"
import {getAccount} from "../build/build-get-account.js"
import {decodeResponse as decode} from "../decode/decode.js"

import {resolveRefBlockId} from "./resolve-ref-block-id.js"
import {resolveCadence} from "./resolve-cadence.js"
import {resolveArguments} from "./resolve-arguments.js"
import {resolveAccounts} from "./resolve-accounts.js"
import {resolveSignatures} from "./resolve-signatures.js"
import {resolveValidators} from "./resolve-validators.js"
import {resolveFinalNormalization} from "./resolve-final-normalization.js"
import {resolveVoucherIntercept} from "./resolve-voucher-intercept.js"
import {resolveComputeLimit} from "./resolve-compute-limit.js"

const noop = v => v
const debug =
  (key, fn = noop) =>
  async ix => {
    const take = (obj, keys = []) => {
      if (typeof keys === "string") keys = keys.split(" ")
      keys.reduce((acc, key) => ({...acc, [key]: obj[key]}), {})
    }

    const accts = ix =>
      [
        "\nAccounts:",
        {
          proposer: ix.proposer,
          authorizations: ix.authorizations,
          payer: ix.payer,
        },
        "\n\nDetails:",
        ix.accounts,
      ].filter(Boolean)

    const log = (...msg) => {
      console.log(`debug[${key}] ---\n`, ...msg, "\n\n\n---")
    }

    if (await config.get(`debug.${key}`)) await fn(ix, log, accts)
    return ix
  }

export const resolve = pipe([
  resolveCadence,
  debug("cadence", (ix, log) => log(ix.message.cadence)),
  resolveComputeLimit,
  debug("compute limit", (ix, log) => log(ix.message.computeLimit)),
  resolveArguments,
  debug("arguments", (ix, log) => log(ix.message.arguments, ix.message)),
  resolveAccounts,
  debug("accounts", (ix, log, accts) => log(...accts(ix))),
  /* special */ execFetchRef,
  /* special */ execFetchSequenceNumber,
  resolveSignatures,
  debug("signatures", (ix, log, accts) => log(...accts(ix))),
  resolveFinalNormalization,
  resolveValidators,
  resolveVoucherIntercept,
  debug("resolved", (ix, log) => log(ix)),
])

async function execFetchRef(ix) {
  if (isTransaction(ix) && ix.message.refBlock == null) {
    const node = await config().get("accessNode.api")
    const sendFn = await config.first(
      ["sdk.transport", "sdk.send"],
      defaultSend
    )

    invariant(
      sendFn,
      `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
    )

    ix.message.refBlock = (
      await sendFn(
        build([getBlock()]),
        {config, response, Buffer, ix: ixModule},
        {node}
      ).then(decode)
    ).id
  }
  return ix
}

async function execFetchSequenceNumber(ix) {
  if (isTransaction(ix)) {
    var acct = Object.values(ix.accounts).find(a => a.role.proposer)
    invariant(acct, `Transactions require a proposer`)
    if (acct.sequenceNum == null) {
      const node = await config().get("accessNode.api")
      const sendFn = await config.first(
        ["sdk.transport", "sdk.send"],
        defaultSend
      )

      invariant(
        sendFn,
        `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
      )

      ix.accounts[acct.tempId].sequenceNum = await sendFn(
        await build([getAccount(acct.addr)]),
        {config, response, Buffer, ix: ixModule},
        {node}
      )
        .then(decode)
        .then(acct => acct.keys)
        .then(keys => keys.find(key => key.index === acct.keyId))
        .then(key => key.sequenceNumber)
    }
  }
  return ix
}
