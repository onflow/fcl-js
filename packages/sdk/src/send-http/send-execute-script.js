import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendExecuteScriptAtBlockIDRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/scripts?block_id=${ix.block.id}`,
    method: "POST",
    body: {
      script: ix.message.cadence,
      arguments: ix.message.arguments.map(arg => ix.arguments[arg].asArgument)
    }
  })

  return constructResponse(ix, res)
}

async function sendExecuteScriptAtBlockHeightRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/scripts?block_height=${ix.block.id}`,
    method: "POST",
    body: {
      script: ix.message.cadence,
      arguments: ix.message.arguments.map(arg => ix.arguments[arg].asArgument)
    }
  })
  
  return constructResponse(ix, res)
}

async function sendExecuteScriptAtLatestBlockRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/scripts`,
    method: "POST",
    body: {
      script: ix.message.cadence,
      arguments: ix.message.arguments.map(arg => ix.arguments[arg].asArgument)
    }
  })

  return constructResponse(ix, res)
}

function constructResponse(ix, res)  {
  let ret = response()
  ret.tag = ix.tag
  ret.encodedData = res.value

  return ret
}

export async function sendExecuteScript(ix, opts = {}) {
  invariant(opts.node, `SDK Send Execute Script Error: opts.node must be defined.`)

  ix = await ix

  if (ix.block.id) {
    return await sendExecuteScriptAtBlockIDRequest(ix, opts)
  } else if (ix.block.height) {
    return await sendExecuteScriptAtBlockHeightRequest(ix, opts)
  } else {
    return await sendExecuteScriptAtLatestBlockRequest(ix, opts)
  }
}
