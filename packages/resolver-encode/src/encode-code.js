import {Ok} from "@qvvg/mario"
import {isScript, isTransaction} from "@onflow/interaction"
import {get} from "@onflow/assigns"
import {scriptToBuffer} from "@onflow/bytes"

export const encodeCode = ix => {
  if (!isScript(ix) && !isTransaction(ix)) return Ok(ix)
  ix.code = scriptToBuffer(get(ix, "code"))
  return Ok(ix)
}
