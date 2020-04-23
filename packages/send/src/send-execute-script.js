import {ExecuteScriptAtLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

export async function sendExecuteScript(ix, opts = {}) {
  const req = new ExecuteScriptAtLatestBlockRequest()
  const code = Buffer.from(ix.payload.code, "utf8")
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtLatestBlock, req)

  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = JSON.parse(Buffer.from(res.getValue_asU8()).toString("utf8"))

  return ret
}
