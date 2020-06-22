import {Ok, isTransaction, get} from "@onflow/interaction"
import {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
} from "@onflow/encode"

const ERROR_MINIMUM_AUTHORIZATIONS =
  "Transactions require at least one authoriztion"

function isFn(v) {
  return typeof v === "function"
}

function isArray(v) {
  return Array.isArray(v)
}

export async function resolveSignatures(ix) {
  if (!isTransaction(ix)) return Ok(ix)

  let authorizors = ix.authorizations.map(tempId => {
    return ix.accounts[tempId]
  })
  let arguments = ix.message.arguments.map(tempId => {
    return ix.arguments[tempId].asArgument
  })
  const payer = ix.accounts[ix.payer]
  const proposer = ix.accounts[ix.proposer]

  const transactionPayload = encodeTransactionPayload({
    script: ix.message.cadence,
    arguments,
    refBlock: ix.message.refBlock || null,
    gasLimit: ix.message.computeLimit,
    proposalKey: {
      address: proposer.addr,
      keyId: proposer.keyId,
      sequenceNum: proposer.sequenceNum,
    },
    payer: payer.addr,
    authorizers: authorizors.map(a => a.addr),
  })

  const axs = authorizors.map(
    async function resolveSignature(authorizer) {
      if (authorizer.addr === payer.addr) {
        ix.accounts[authorizer.tempId] = {
            ...ix.accounts[authorizer.tempId],
            signature: null
        }
        return
      }

      const authzSignature = await authorizer.signingFunction({
        message: transactionPayload,
        addr: authorizer.addr,
        keyId: authorizer.keyId,
        roles: {
          proposer: proposer.addr === authorizer.addr,
          authorizer: true,
          payer: payer.addr === authorizer.addr,
        },
        interaction: ix,
      })

      ix.accounts[authorizer.tempId] = {
          ...ix.accounts[authorizer.tempId],
          signature: authzSignature.signature,
      }
    }
  )

  await Promise.all(axs)

  authorizors = ix.authorizations.map(tempId => {
    return ix.accounts[tempId]
  })

  const transactionEnvelope = encodeTransactionEnvelope({
    script: ix.message.cadence,
    arguments,
    refBlock: ix.message.refBlock || null,
    gasLimit: ix.message.computeLimit,
    proposalKey: {
      address: proposer.addr,
      keyId: proposer.keyId,
      sequenceNum: proposer.sequenceNum,
    },
    payer: payer.addr,
    authorizers: authorizors.map(a => a.addr),
    payloadSigs: authorizors
      .map(ax => {
        if (ax.signature === null) return null
        return {
          address: ax.addr,
          keyId: ax.keyId,
          sig: ax.signature,
        }
      })
      .filter(ps => ps !== null),
  })

  const payerSignature = await payer.signingFunction({
    message: transactionEnvelope,
    addr: payer.addr,
    keyId: payer.keyId,
    arguments,
    roles: {
      proposer: proposer.addr === payer.addr,
      authorizer: Boolean(authorizors.find(a => a.addr === payer.addr)),
      payer: true,
    },
    interaction: ix,
  })

  ix.accounts[ix.payer] = {
      ...ix.accounts[ix.payer],
      signature: payerSignature.signature,
  }

  return Ok(ix)
}
