import {Ok} from "@qvvg/mario"
import {isGetEvents} from "@onflow/interaction"
import {get} from "@onflow/assigns"

export const encodeStartBlock = ix => {
  if (!isGetEvents(ix)) return Ok(ix)
  ix.startBlock = Number(get(ix, "startBlock"))
  return Ok(ix)
}
