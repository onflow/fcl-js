import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetCollection(ix, opts = {}) {
  invariant(opts.node, `SDK Send Get Collection Error: opts.node must be defined.`)
  
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/collections/${ix.collection.id}`,
    method: "GET",
    body: null
  })

  const ret = response()
  ret.tag = ix.tag
  ret.collection = {
    id: res.id,
    transactionIds: null, // CHECK IF WE NEED TO HAVE BACKWARD COMPATIBILITY HERE
    transactions: res.transactions
  }

  return ret
}
