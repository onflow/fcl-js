import {Ok} from "@qvvg/mario"
import {isGetTransaction} from "@onflow/interaction"
import {get} from "@onflow/assigns"
import {hashToBuffer} from "@onflow/bytes"

export const encodeHash = ix => {
  if (!isGetTransaction(ix)) return Ok(ix)
  ix.hash = hashToBuffer(get(ix, "hash"))
  return Ok(ix)
}
