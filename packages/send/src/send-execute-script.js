import {ExecuteScriptRequest, ObserveService} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

export async function sendExecuteScript(ix, opts = {}) {
  const req = new ExecuteScriptRequest()
  req.setScript(ix.code)

  const res = await unary(opts.node, ObserveService.ExecuteScript, req)

  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = res.getValue_asU8()
  ret.decodeInstructions = null // TODO: Populate with data the access api will eventually return

  return ret
}
