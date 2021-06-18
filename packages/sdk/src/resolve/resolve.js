import {pipe, isTransaction} from "../interaction/interaction.js"
import {config} from "../config"
import {invariant} from "@onflow/util-invariant"

import {send} from "../send/sdk-send.js"
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

export const resolve = pipe([
  resolveCadence,
  resolveArguments,
  resolveAccounts,
  /* special */ execFetchRef,
  /* special */ execFetchSequenceNumber,
  resolveSignatures,
  resolveFinalNormalization,
  resolveValidators,
])

async function execFetchRef(ix) {
  if (isTransaction(ix) && ix.message.refBlock == null) {
    ix.message.refBlock = (await send(build([getBlock()])).then(decode)).id
  }
  return ix
}

async function execFetchSequenceNumber(ix) {
  if (isTransaction(ix)) {
    var acct = Object.values(ix.accounts).find(a => a.role.proposer)
    invariant(acct, `Transactions require a proposer`)
    if (acct.sequenceNum == null) {
      ix.accounts[acct.tempId].sequenceNum = await send(
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
