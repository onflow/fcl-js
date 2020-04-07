import {ExecuteScriptRequest, ObserveService} from "@onflow/protobuf"
import {get} from "@onflow/interaction"
import {scriptToBuffer} from "@onflow/bytes"
import {response} from "@onflow/response"
import {unary} from "./unary"

export async function sendExecuteScript(ix, opts = {}) {
  const req = new ExecuteScriptRequest()
  const code = scriptToBuffer(ix.payload.code)
  req.setScript(code)

  const res = await unary(opts.node, ObserveService.ExecuteScript, req)

  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = res.getValue_asU8()
  ret.decodeInstructions = null // TODO: Populate with data the access api will eventually return

  return ret
}
