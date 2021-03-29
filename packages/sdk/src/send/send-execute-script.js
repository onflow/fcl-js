import {ExecuteScriptAtLatestBlockRequest, ExecuteScriptAtBlockIDRequest, ExecuteScriptAtBlockHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendExecuteScript(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  let req
  let res
  if (ix.block.id) {
    req = new ExecuteScriptAtBlockIDRequest()
    
    req.setBlockId(hexBuffer(ix.block.id))

    const code = Buffer.from(ix.message.cadence, "utf8")
    ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
    req.setScript(code)

    res = await unary(opts.node, AccessAPI.ExecuteScriptAtBlockID, req)
  } else if (ix.block.height) {
    req = new ExecuteScriptAtBlockHeightRequest()

    req.setBlockHeight(Number(ix.block.height))

    const code = Buffer.from(ix.message.cadence, "utf8")
    ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
    req.setScript(code)

    res = await unary(opts.node, AccessAPI.ExecuteScriptAtBlockHeight, req) 
  } else {
    req = new ExecuteScriptAtLatestBlockRequest()

    const code = Buffer.from(ix.message.cadence, "utf8")
    ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
    req.setScript(code)

    res = await unary(opts.node, AccessAPI.ExecuteScriptAtLatestBlock, req)
  }

  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = JSON.parse(Buffer.from(res.getValue_asU8()).toString("utf8"))

  return ret
}
