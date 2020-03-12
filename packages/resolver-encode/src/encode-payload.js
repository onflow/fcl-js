const RLP = require("RLP")
import {Ok} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"

export const encodePayload = ix => {
  if (!isTransaction(ix)) return Ok(ix)

  ix.payload = RLP.encode([
    ix.code,
    ix.referenceBlockHash,
    ix.nonce,
    ix.computeLimit,
    ix.payerAuthorization.acct,
    ix.authorizations.map(a => a.acct)
  ])

  return Ok(ix)
}
