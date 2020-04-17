import {ExecuteScriptAtLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {scriptToBuffer} from "@onflow/bytes"
import {response} from "@onflow/response"
import {unary} from "./unary"

export async function sendExecuteScript(ix, opts = {}) {
  const req = new ExecuteScriptAtLatestBlockRequest()
  const code = scriptToBuffer(ix.payload.code)
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtLatestBlock, req)

  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = res.getValue_asU8()

  return ret
}
