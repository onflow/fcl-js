import {Ok} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"
import {get} from "@onflow/assigns"

// NOTE: how nonces work will be quite differnt in the future
//       this is a simple implementation that works for now
export const getNonce = () => Date.now()

export const encodeNonce = ix => {
  if (!isTransaction(ix)) return Ok(ix)
  ix.nonce = get(ix, "nonce", getNonce())
  return Ok(ix)
}
