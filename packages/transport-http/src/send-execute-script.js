import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendExecuteScriptAtBlockIDRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/scripts?block_id=${ix.block.id}`,
    method: "POST",
    body: {
      "script": Buffer.from(ix.message.cadence).toString("base64"),
      "arguments": ix.message.arguments.map(arg => ix.arguments[arg].asArgument)
    }
  })

  return constructResponse(ix, context, res)
}

async function sendExecuteScriptAtBlockHeightRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/scripts?block_height=${ix.block.height}`,
    method: "POST",
    body: {
      "script": Buffer.from(ix.message.cadence).toString("base64"),
      "arguments": ix.message.arguments.map(arg => ix.arguments[arg].asArgument)
    }
  })
  
  return constructResponse(ix, context, res)
}

async function sendExecuteScriptAtLatestBlockRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/scripts?block_height=sealed`,
    method: "POST",
    body: {
      "script": Buffer.from(ix.message.cadence).toString("base64"),
      "arguments": ix.message.arguments.map(arg => ix.arguments[arg].asArgument)
    }
  })

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res)  {
  let ret = context.response()
  ret.tag = ix.tag
  ret.encodedData = JSON.parse(Buffer.from(res, "base64").toString())

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
