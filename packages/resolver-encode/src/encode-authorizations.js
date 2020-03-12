import {Ok} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"
import {addressToBuffer, bytes} from "@onflow/bytes"
import {get} from "@onflow/assigns"

export const encodeAuthorizations = ix => {
  if (!isTransaction(ix)) return Ok(ix)
  ix.authorizations = get(ix, "authorizations").map(({acct, signFn}) => ({
    acct: addressToBuffer(bytes(acct, 20)),
    signFn
  }))
  return Ok(ix)
}
