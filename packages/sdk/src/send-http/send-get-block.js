import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendGetBlockByIDRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks/${ix.block.id}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

async function sendGetBlockByHeightRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks?height=${ix.block.height}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

async function sendGetBlockRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks?height=${ix.block.height}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
  const ret = response()
  ret.tag = ix.tag
  ret.block = res

  return ret
}

export async function sendGetBlock(ix, opts = {}) {
  invariant(opts.node, `SDK Send Get Block Error: opts.node must be defined.`)

  ix = await ix

  const interactionHasBlockID = ix.block.id !== null
  const interactionHasBlockHeight = ix.block.height !== null

  if (interactionHasBlockID) {
    return await sendGetBlockByIDRequest(ix, opts)
  } else if (interactionHasBlockHeight) {
    return await sendGetBlockByHeightRequest(ix, opts)
  } else {
    return await sendGetBlockRequest(ix, opts)
  }
}
