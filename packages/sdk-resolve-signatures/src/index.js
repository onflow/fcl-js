import {isTransaction} from "@onflow/interaction"
import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "@onflow/encode"

function prepForEncoding(ix) {
  return {
    script: ix.message.cadence,
    refBlock: ix.message.refBlock || null,
    gasLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map(cid => ix.arguments[cid].asArgument),
    proposalKey: {
      address: ix.accounts[ix.proposer].addr,
      keyId: ix.accounts[ix.proposer].keyId,
      sequenceNum: ix.accounts[ix.proposer].sequenceNum,
    },
    payer: ix.accounts[ix.payer].addr,
    authorizers: ix.authorizations.map(cid => ix.accounts[cid].addr),
  }
}

async function fetchSignatures(ix, signers = [], message) {
  return Promise.all(
    signers.map(async cid => {
      const compSig = await ix.accounts[cid].signingFunction({
        message,
        addr: ix.accounts[cid].addr,
        keyId: ix.accounts[cid].keyId,
        roles: ix.accounts[cid].role, // grr this should be roles,
        interaction: ix,
      })
      compSig.cid = cid
      if (ix.accounts[cid].addr !== compSig.addr) {
        throw new Error(`${cid} — mismatching address in composite signature`)
      }
      if (ix.accounts[cid].keyId !== compSig.keyId) {
        throw new Error(`${cid} — mismatching keyId in composite signature`)
      }
      compSig.sig = compSig.signature
      compSig.address = compSig.addr
      return compSig
    })
  )
}

function collateSigners(ix) {
  // inside signers are: (authorizers + proposer) - payer
  let insideSigners = new Set(ix.authorizations)
  insideSigners.add(ix.proposer)
  insideSigners.delete(ix.payer)
  insideSigners = Array.from(insideSigners)

  // outside signers are: payer
  let outsideSigners = new Set([ix.payer])
  outsideSigners = Array.from(outsideSigners)

  return {insideSigners, outsideSigners}
}

function mutateAccountsWithSignatures(ix, compSigs) {
  for (let {cid, signature} of compSigs) {
    ix.accounts[cid].signature = signature
  }
  return compSigs
}

export async function resolveSignatures(ix) {
  if (!isTransaction(ix)) return ix

  const {insideSigners, outsideSigners} = collateSigners(ix)

  // Get inside composite signatures for inside payload in parallel
  const insideSignatures = mutateAccountsWithSignatures(
    ix,
    await fetchSignatures(
      ix,
      insideSigners,
      encodeInsideMessage(prepForEncoding(ix))
    )
  )

  // Get outside composite signatures for outside payload in parallel
  const outsideSignatures = mutateAccountsWithSignatures(
    ix,
    await fetchSignatures(
      ix,
      outsideSigners,
      encodeOutsideMessage({
        ...prepForEncoding(ix),
        payloadSigs: insideSignatures,
      })
    )
  )

  return ix
}

// TODO — WHAT WE WANT INSTEAD OF WHAT WE HAVE
//
// encodeInsideMessage({
//   cadence: ___,
//   refBlock: ___,
//   computeLimit: ___,
//   proposer: {
//     addr: ___,
//     keyId: ___,
//     sequenceNum: __,
//   },
//   payer: ___,
//   authorizers: [___],
// })
//
// encodeInsideMessage({
//   ...ix.message,
//   proposer: ix.accounts[ix.proposer],
//   payer: ix.accounts[ix.payer].addr,
//   authorizers: ix.authorizers.map(cid => ix.accounts[cid].addr)
// })
//
// encodeOutsideMessage({
//   cadence: ___,
//   refBlock: ___,
//   computeLimit: ___,
//   proposer: {
//     addr: ___,
//     keyId: ___,
//     sequenceNum: __,
//   },
//   payer: ___,
//   authorizers: [___],
//   payloadSigs: [{ addr, keyId, signature }],
// })
//
// encodeOutsideMessage({
//   ...ix.message,
//   proposer: ix.accounts[ix.proposer],
//   payer: ix.accounts[ix.payer].addr,
//   authorizers: ix.authorizers.map(cid => ix.accounts[cid].addr),
//   payloadSigs: insideSignatures,
// })
