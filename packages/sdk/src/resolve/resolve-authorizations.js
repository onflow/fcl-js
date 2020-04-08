import {Ok, Nope, isTransaction, get} from "@onflow/interaction"
import {addressToBuffer} from "@onflow/bytes"

const ERROR_MINIMUM_AUTHORIZATIONS =
  "Transactions require at least one authoriztion"

function buildAuthorization(acct, signature) {
  return {acct, signature}
}

function isFn(v) {
  return typeof v === "function"
}

function isArray(v) {
  return Array.isArray(v)
}

function hasMinAuthorizations(ix) {
  const axs = get(ix, "tx.authorizations")
  return axs != null && isArray(axs) && axs.length >= 1
}

export async function resolveAuthorizations(ix) {
  if (!isTransaction(ix)) return Ok(ix)
  if (!hasMinAuthorizations(ix)) return Nope(ix, ERROR_MINIMUM_AUTHORIZATIONS)

  const payload = get(ix, "tx.payload")

  const axs = get(ix, "tx.authorizations", []).map(
    async function resolveAuthorization(authz) {
      if (isFn(authz)) authz = await authz()
      return buildAuthorization(authz.acct, await authz.signFn(payload))
    }
  )

  const payer = get(ix, "tx.payer")
  ix.payer = buildAuthorization(payer.acct, await payer.signFn(payload))

  ix.authz = await Promise.all(axs)
  return Ok(ix)
}
