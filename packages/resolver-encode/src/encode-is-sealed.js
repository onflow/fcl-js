import {Ok} from "@qvvg/mario"
import {isGetLatestBlock} from "@onflow/interaction"
import {get} from "@onflow/assigns"

export const encodeIsSealed = ix => {
  if (!isGetLatestBlock(ix)) return Ok(ix)
  ix.isSealed = get(ix, "isSealed")
  return Ok(ix)
}
