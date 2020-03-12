import {Ok} from "@qvvg/mario"
import {isTransaction} from "@onflow/interaction"
import {get} from "@onflow/assigns"

export const encodeComputeLimit = ix => {
  if (!isTransaction(ix)) return Ok(ix)
  ix.computeLimit = get(ix, "computeLimit", 10)
  return Ok(ix)
}
