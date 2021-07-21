import {ExecuteScriptAtLatestBlockRequest, ExecuteScriptAtBlockIDRequest, ExecuteScriptAtBlockHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendExecuteScriptAtBlockIDRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new ExecuteScriptAtBlockIDRequest()

  req.setBlockId(hexBuffer(ix.block.id))

  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtBlockID, req)

  return constructResponse(ix, res)
}

async function sendExecuteScriptAtBlockHeightRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new ExecuteScriptAtBlockHeightRequest()

  req.setBlockHeight(Number(ix.block.height))

  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtBlockHeight, req) 
  
  return constructResponse(ix, res)
}

async function sendExecuteScriptAtLatestBlockRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new ExecuteScriptAtLatestBlockRequest()
  
  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtLatestBlock, req)

  return constructResponse(ix, res)
}

function constructResponse(ix, res)  {
  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = JSON.parse(Buffer.from(res.getValue_asU8()).toString("utf8"))

  return ret
}

export async function sendExecuteScript(ix, opts = {}) {
  ix = await ix

  if (ix.block.id) {
    return await sendExecuteScriptAtBlockIDRequest(ix, opts)
  } else if (ix.block.height) {
    return await sendExecuteScriptAtBlockHeightRequest(ix, opts)
  } else {
    return await sendExecuteScriptAtLatestBlockRequest(ix, opts)
  }
}
