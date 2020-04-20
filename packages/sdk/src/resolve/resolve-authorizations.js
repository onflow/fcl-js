import {Ok, isTransaction, get} from "@onflow/interaction"
import {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
} from "@onflow/encode"

const ERROR_MINIMUM_AUTHORIZATIONS =
  "Transactions require at least one authoriztion"

function buildAuthorization(acct, signature, keyId) {
  return {acct, signature, keyId}
}

function isFn(v) {
  return typeof v === "function"
}

function isArray(v) {
  return Array.isArray(v)
}

export async function resolveAuthorizations(ix) {
  if (!isTransaction(ix)) return Ok(ix)

  const transactionPayload = encodeTransactionPayload({
    script: ix.payload.code,
    refBlock: ix.payload.ref || null,
    gasLimit: ix.payload.limit,
    proposalKey: {
      address: ix.proposer.addr,
      keyId: ix.proposer.keyId,
      sequenceNum: ix.proposer.sequenceNum,
    },
    payer: get(ix, "tx.payer").acct,
    authorizers: get(ix, "tx.authorizations").map(a => a.acct),
  })

  const axs = get(ix, "tx.authorizations", []).map(
    async function resolveAuthorization(authz) {
      if (isFn(authz)) authz = await authz()
      if (authz.acct === get(ix, "tx.payer").acct)
        return buildAuthorization(authz.acct, null, authz.keyId)
      const authzSignature = await authz.signFn({
        message: transactionPayload,
        addr: authz.acct,
        keyId: authz.keyId,
        roles: {
          proposer: ix.proposer.addr === authz.acct,
          authorizer: true,
          payer: get(ix, "tx.payer").acct === authz.acct,
        },
        interaction: ix,
      })
      return buildAuthorization(
        authz.acct,
        authzSignature.signature,
        authz.keyId
      )
    }
  )

  ix.authz = await Promise.all(axs)

  const transactionEnvelope = encodeTransactionEnvelope({
    script: ix.payload.code,
    refBlock: ix.payload.ref,
    gasLimit: ix.payload.limit,
    proposalKey: {
      address: ix.proposer.addr,
      keyId: ix.proposer.keyId,
      sequenceNum: ix.proposer.sequenceNum,
    },
    payer: get(ix, "tx.payer").acct,
    authorizers: get(ix, "tx.authorizations").map(a => a.acct),
    payloadSigs: ix.authz
      .map(ax => {
        if (ax.signature === null) return null
        return {
          address: ax.acct,
          keyId: ax.keyId,
          sig: ax.signature,
        }
      })
      .filter(ps => ps !== null),
  })

  const payer = get(ix, "tx.payer")
  const payerSignature = await payer.signFn({
    message: transactionEnvelope,
    addr: payer.acct,
    keyId: payer.keyId,
    roles: {
      proposer: ix.proposer.addr === payer.acct,
      authorizer: false,
      payer: true,
    },
    interaction: ix,
  })
  ix.payer = buildAuthorization(
    payer.acct,
    payerSignature.signature,
    payer.keyId
  )

  return Ok(ix)
}
