import {Ok, Nope} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"
import {addressToBuffer} from "@onflow/bytes"
import {get} from "@onflow/assigns"

const ERROR_MINIMUM_AUTHORIZATIONS =
  "Transactions require at least one authoriztion"

const buildSignature = (acct, signature) => ({acct, signature})

export const resolveSignatures = async ix => {
  if (!isTransaction(ix)) return Ok(ix)
  if (get(ix, "authorizations") == null)
    return Nope(ix, ERROR_MINIMUM_AUTHORIZATIONS)
  if (get(ix, "authorizations").length < 1)
    return Nope(ix, ERROR_MINIMUM_AUTHORIZATIONS)

  const axs = ix.authorizations.map(
    authz =>
      new Promise(async resolve => {
        const signature = await authz.signFn(ix.payload)
        const account = authz.acct
        resolve(buildSignature(account, signature))
      })
  )

  ix.signatures = await Promise.all(axs)

  return Ok(ix)
}
