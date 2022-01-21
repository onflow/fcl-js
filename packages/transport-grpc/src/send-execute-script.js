import {invariant} from "@onflow/util-invariant"
import {ExecuteScriptAtLatestBlockRequest, ExecuteScriptAtBlockIDRequest, ExecuteScriptAtBlockHeightRequest, AccessAPI} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendExecuteScriptAtBlockIDRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new ExecuteScriptAtBlockIDRequest()

  req.setBlockId(hexBuffer(ix.block.id))

  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtBlockID, req, context)

  return constructResponse(ix, context, res)
}

async function sendExecuteScriptAtBlockHeightRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new ExecuteScriptAtBlockHeightRequest()

  req.setBlockHeight(Number(ix.block.height))

  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtBlockHeight, req, context) 
  
  return constructResponse(ix, context, res)
}

async function sendExecuteScriptAtLatestBlockRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new ExecuteScriptAtLatestBlockRequest()
  
  const code = Buffer.from(ix.message.cadence, "utf8")
  ix.message.arguments.forEach(arg => req.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  req.setScript(code)

  const res = await unary(opts.node, AccessAPI.ExecuteScriptAtLatestBlock, req, context)

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res)  {
  let ret = context.response()
  ret.tag = ix.tag
  ret.encodedData = JSON.parse(Buffer.from(res.getValue_asU8()).toString("utf8"))

  return ret
}

export async function sendExecuteScript(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Execute Script Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Execute Script Error: context.response must be defined.`)
  
  ix = await ix

  if (ix.block.id) {
    return await sendExecuteScriptAtBlockIDRequest(ix, context, opts)
  } else if (ix.block.height) {
    return await sendExecuteScriptAtBlockHeightRequest(ix, context, opts)
  } else {
    return await sendExecuteScriptAtLatestBlockRequest(ix, context, opts)
  }
}
