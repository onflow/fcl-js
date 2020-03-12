import {Ok} from "@qvvg/mario"
import {isGetAccount} from "@onflow/interaction"
import {addressToBuffer, bytes} from "@onflow/bytes"
import {get} from "@onflow/assigns"

export const encodeAddress = ix => {
  if (!isGetAccount(ix)) return Ok(ix)
  ix.address = addressToBuffer(bytes(get(ix, "address"), 20))
  return Ok(ix)
}
