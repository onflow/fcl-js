import {pipe, isTransaction} from "../interaction/interaction.js"
import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"

import {latestBlock} from "../latest-block/latest-block.js"
import {account as fetchAccount} from "../account/account.js"

import {resolveRefBlockId} from "./resolve-ref-block-id.js"
import {resolveCadence} from "./resolve-cadence.js"
import {resolveArguments} from "./resolve-arguments.js"
import {resolveAccounts} from "./resolve-accounts.js"
import {resolveSignatures} from "./resolve-signatures.js"
import {resolveValidators} from "./resolve-validators.js"
import {resolveFinalNormalization} from "./resolve-final-normalization.js"

// export const resolve = pipe([
//   resolveCadence,
//   resolveArguments,
//   resolveAccounts,
//   resolveRefBlockId(opts),
//   resolveSignatures,
//   resolveValidators,
// ])

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
        ix.message.refBlock = (await latestBlock()).id
    }
    return ix
}

async function execFetchSequenceNumber(ix) {
if (isTransaction(ix)) {
    var acct = Object.values(ix.accounts).find(a => a.role.proposer)
    invariant(acct, `Transactions require a proposer`)
    if (acct.sequenceNum == null) {
    ix.accounts[acct.tempId].sequenceNum = await fetchAccount(acct.addr)
        .then(acct => acct.keys)
        .then(keys => keys.find(key => key.index === acct.keyId))
        .then(key => key.sequenceNumber)
    }
}
return ix
}
  