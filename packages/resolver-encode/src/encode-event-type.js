import {Ok} from "@qvvg/mario"
import {isGetEvents} from "@onflow/interaction"
import {get} from "@onflow/assigns"

export const encodeEventType = ix => {
  if (!isGetEvents(ix)) return Ok(ix)
  ix.eventType = get(ix, "eventType")
  return Ok(ix)
}
