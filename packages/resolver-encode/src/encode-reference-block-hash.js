import {Ok} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"
import {get} from "@onflow/assigns"

export const encodeReferenceBlockHash = ix => {
  if (!isTransaction(ix)) return Ok(ix)
  ix.referenceBlockHash = get(ix, "referenceBlockHash")
  return Ok(ix)
}
