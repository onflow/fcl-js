import {Ok, isTransaction} from "@onflow/interaction"
import {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
} from "@onflow/encode"

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

export async function resolveSignatures(ix) {
  if (!isTransaction(ix)) return Ok(ix)

  var insideSigners, insideSignatures, outsideSigners, outsideSignatures

  // inside signers are: (authorizers + proposer) - payer
  try {
    insideSigners = new Set(ix.authorizations)
    insideSigners.add(ix.proposer)
    insideSigners.delete(ix.payer)
    insideSigners = Array.from(insideSigners)
  } catch (error) {
    console.error("Inside Signer Discovery", error, {
      ix,
      insideSigners,
      insideSignatures,
      outsideSigners,
      outsideSignatures,
    })
    throw error
  }

  // outside signers are: payer
  try {
    outsideSigners = new Set([ix.payer])
    outsideSigners = Array.from(outsideSigners)
  } catch (error) {
    console.error("Outside Signer Discovery", error, {
      ix,
      insideSigners,
      insideSignatures,
      outsideSigners,
      outsideSignatures,
    })
    throw error
  }

  // Get inside composite signatures for inside payload in parallel
  try {
    insideSignatures = await fetchSignatures(
      ix,
      insideSigners,
      encodeTransactionPayload({
        script: ix.message.cadence,
        refBlock: ix.message.refBlock || null,
        gasLimit: ix.message.computeLimit,
        proposalKey: {
          address: ix.accounts[ix.proposer].addr,
          keyId: ix.accounts[ix.proposer].keyId,
          sequenceNum: ix.accounts[ix.proposer].sequenceNum,
        },
        payer: ix.accounts[ix.payer].addr,
        authorizers: ix.authorizations.map(cid => ix.accounts[cid].addr),
      })
    )
    // add signatures to accounts
    for (let {cid, signature} of insideSignatures) {
      ix.accounts[cid].signature = signature
    }
  } catch (error) {
    console.error("Fetching of Inside Signatures", error, {
      ix,
      insideSigners,
      insideSignatures,
      outsideSigners,
      outsideSignatures,
    })
    throw error
  }

  // Get outside composite signatures for outside payload in parallel
  try {
    outsideSignatures = await fetchSignatures(
      ix,
      outsideSigners,
      encodeTransactionEnvelope({
        script: ix.message.cadence,
        refBlock: ix.message.refBlock || null,
        gasLimit: ix.message.computeLimit,
        proposalKey: {
          address: ix.accounts[ix.proposer].addr,
          keyId: ix.accounts[ix.proposer].keyId,
          sequenceNum: ix.accounts[ix.proposer].sequenceNum,
        },
        payer: ix.accounts[ix.payer].addr,
        authorizers: ix.authorizations.map(cid => ix.accounts[cid].addr),
        payloadSigs: insideSignatures,
      })
    )
    // add signatures to accounts
    for (let {cid, signature} of outsideSignatures) {
      ix.accounts[cid].signature = signature
    }
  } catch (error) {
    console.error("Fetching of Outside Signatures", error, {
      ix,
      insideSigners,
      insideSignatures,
      outsideSigners,
      outsideSignatures,
    })
    throw error
  }

  return Ok(ix)
}

// TODO — WHAT WE WANT INSTEAD OF WHAT WE HAVE
//
// encodeTransactionPayload({
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
// encodeTransactionPayload({
//   ...ix.message,
//   proposer: ix.accounts[ix.proposer],
//   payer: ix.accounts[ix.payer].addr,
//   authorizers: ix.authorizers.map(cid => ix.accounts[cid].addr)
// })
//
// encodeTransactionEnvelope({
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
// encodeTransactionEnvelope({
//   ...ix.message,
//   proposer: ix.accounts[ix.proposer],
//   payer: ix.accounts[ix.payer].addr,
//   authorizers: ix.authorizers.map(cid => ix.accounts[cid].addr),
//   payloadSigs: insideSignatures,
// })
