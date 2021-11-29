import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendGetAccountAtBlockHeightRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/accounts/${ix.account.addr}?block_height=${ix.block.height}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

async function sendGetAccountAtLatestBlockRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/accounts/${ix.account.addr}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
  let ret = response()
  ret.tag = ix.tag

  ret.account = {
    address: res.address,
    balance: res.balance,
    code: null, // CHECK IF THIS WILL BE RETURNED AS WELL
    contracts: res.contracts,
    keys: res.keys // VERIFY THAT KEYS WILL CONTAIN NUMBERED REPRESENTATIONS OF SIG / HASH ALGOS FOR BACKWARDS COMPATIBILITY https://docs.onflow.org/cadence/language/crypto/#hashing
  }

  return ret
}


export async function sendGetAccount(ix, opts = {}) {
  invariant(opts.node, `SDK Send Get Account Error: opts.node must be defined.`)

  ix = await ix

  if (ix.block.height !== null) {
    return await sendGetAccountAtBlockHeightRequest(ix, opts)
  } else {
    return await sendGetAccountAtLatestBlockRequest(ix, opts)
  }
}
