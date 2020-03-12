import {Ok} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"
import {addressToBuffer, bytes} from "@onflow/bytes"
import {get} from "@onflow/assigns"

export const encodePayerAuthorization = ix => {
  if (!isTransaction(ix)) return Ok(ix)
  const payerAuthorization = get(ix, "payerAuthorization")
  ix.payerAuthorization = {
    acct: addressToBuffer(bytes(payerAuthorization.acct, 20)),
    signFn: payerAuthorization.signFn
  }
  return Ok(ix)
}
