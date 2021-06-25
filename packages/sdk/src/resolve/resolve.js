import {pipe, isTransaction} from "../interaction/interaction"
import {config} from "../config"
import {invariant} from "@onflow/util-invariant"

import {send} from "../send/sdk-send"
import {build} from "../build/build"
import {getBlock} from "../build/build-get-block"
import {getAccount} from "../build/build-get-account"
import {decodeResponse as decode} from "../decode/decode"

import {resolveRefBlockId} from "./resolve-ref-block-id"
import {resolveCadence} from "./resolve-cadence"
import {resolveArguments} from "./resolve-arguments"
import {resolveAccounts} from "./resolve-accounts"
import {resolveSignatures} from "./resolve-signatures"
import {resolveValidators} from "./resolve-validators"
import {resolveFinalNormalization} from "./resolve-final-normalization"

const debug = key => async (...args) => {
  if (await config().get(`debug.${key}`)) {
    console.log(`debug.${key}`, "---\n\n", ...args, "\n\n---")
  }
}

export const resolve = pipe([
  resolveCadence,
  async ix => {
    await debug("resolvedCadence")(ix.message.cadence)
    return ix
  },
  resolveArguments,
  async ix => {
    await debug("resolvedArguments")(ix.message.arguments, ix.arguments)
    return ix
  },
  resolveAccounts,
  async ix => {
    await debug("resolvedAccounts")(
      {
        proposer: ix.proposer,
        payer: ix.payer,
        authorizations: ix.authorizations,
      },
      ix.accounts
    )
    return ix
  },
  /* special */ execFetchRef,
  /* special */ execFetchSequenceNumber,
  resolveSignatures,
  async ix => {
    await debug("resolvedSignatures")(
      {
        proposer: ix.proposer,
        payer: ix.payer,
        authorizations: ix.authorizations,
      },
      ix.accounts
    )
    return ix
  },
  resolveFinalNormalization,
  resolveValidators,
  async ix => {
    await debug("resolved")(ix)
    return ix
  },
])

async function execFetchRef(ix) {
  if (isTransaction(ix) && ix.message.refBlock == null) {
    const sendFn = await config().get("sdk.send", send)
    ix.message.refBlock = (await sendFn(build([getBlock()])).then(decode)).id
  }
  return ix
}

async function execFetchSequenceNumber(ix) {
  if (isTransaction(ix)) {
    const sendFn = await config().get("sdk.send", send)
    // console.log(">>>", ix.proposer, ix.accounts[ix.proposer])
    var acct = ix.accounts[ix.proposer]
    invariant(acct, `Transactions require a proposer`)
    if (acct.sequenceNum == null) {
      ix.accounts[acct.tempId].sequenceNum = await sendFn(
        await build([getAccount(acct.addr)])
      )
        .then(decode)
        .then(acct => acct.keys)
        .then(keys => keys.find(key => key.index === acct.keyId))
        .then(key => key.sequenceNumber)
    }
  }
  return ix
}
