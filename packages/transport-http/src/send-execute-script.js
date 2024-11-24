import {invariant} from "@onflow/util-invariant"
import {Buffer} from "@onflow/rlp"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendExecuteScriptAtBlockIDRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/scripts?block_id=${ix.block.id}`,
    method: "POST",
    body: {
      script: context.Buffer.from(ix.message.cadence).toString("base64"),
      arguments: ix.message.arguments.map(arg =>
        context.Buffer.from(
          JSON.stringify(ix.arguments[arg].asArgument)
        ).toString("base64")
      ),
    },
  })

  return constructResponse(ix, context, res)
}

async function sendExecuteScriptAtBlockHeightRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/scripts?block_height=${ix.block.height}`,
    method: "POST",
    body: {
      script: context.Buffer.from(ix.message.cadence).toString("base64"),
      arguments: ix.message.arguments.map(arg =>
        context.Buffer.from(
          JSON.stringify(ix.arguments[arg].asArgument)
        ).toString("base64")
      ),
    },
  })

  return constructResponse(ix, context, res)
}

async function sendExecuteScriptAtLatestBlockRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/scripts?block_height=sealed`,
    method: "POST",
    body: {
      script: context.Buffer.from(ix.message.cadence).toString("base64"),
      arguments: ix.message.arguments.map(arg =>
        context.Buffer.from(
          JSON.stringify(ix.arguments[arg].asArgument)
        ).toString("base64")
      ),
    },
  })

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.encodedData = JSON.parse(context.Buffer.from(res, "base64").toString())

  return ret
}

export async function sendExecuteScript(ix, context = {}, opts = {}) {
  invariant(
    opts.node,
    `SDK Send Execute Script Error: opts.node must be defined.`
  )
  invariant(
    context.response,
    `SDK Send Execute Script Error: context.response must be defined.`
  )
  invariant(
    context.Buffer,
    `SDK Send Execute Script Error: context.Buffer must be defined.`
  )

  ix = await ix

  if (ix.block.id) {
    return await sendExecuteScriptAtBlockIDRequest(ix, context, opts)
  } else if (ix.block.height) {
    return await sendExecuteScriptAtBlockHeightRequest(ix, context, opts)
  } else {
    return await sendExecuteScriptAtLatestBlockRequest(ix, context, opts)
  }
}
