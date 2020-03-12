import {Ok} from "@qvvg/mario"
import {isGetEvents} from "@onflow/interaction"
import {get} from "@onflow/assigns"

export const encodeEndBlock = ix => {
  if (!isGetEvents(ix)) return Ok(ix)
  ix.endBlock = Number(get(ix, "endBlock"))
  return Ok(ix)
}
