import {pipe} from "@onflow/interaction"
import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {isTransaction} from "@onflow/interaction"
import {latestBlock} from "@onflow/sdk-latest-block"
import {account as fetchAccount} from "@onflow/sdk-account"

import {resolveCadence} from "./resolvers/resolve-cadence.js"
import {resolveArguments} from "./resolvers/resolve-arguments.js"
import {resolveAccounts} from "./resolvers/resolve-accounts.js"
import {resolveSignatures} from "./resolvers/resolve-signatures.js"
import {resolveFinalNormalization} from "./resolvers/resolve-final-normalization.js"

export const resolve = pipe([
  resolveCadence,
  resolveArguments,
  resolveAccounts,
  /* special */ execFetchRef,
  /* special */ execFetchSequenceNumber,
  resolveSignatures,
  resolveFinalNormalization,
])

config().put("sdk.resolve", resolve)

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
