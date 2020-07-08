import {ExecuteScriptAtLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")

export async function sendExecuteScript(ix, opts = {}) {
  const req = new ExecuteScriptAtLatestBlockRequest()
  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtLatestBlock, req)

  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = JSON.parse(Buffer.from(res.getValue_asU8()).toString("utf8"))

  return ret
}
