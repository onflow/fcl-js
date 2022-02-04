import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

const STATUS_MAP = {
  "UNKNOWN": 0,
  "PENDING": 1,
  "FINALIZED": 2,
  "EXECUTED": 3,
  "SEALED": 4,
  "EXPIRED": 5
}

export async function sendGetTransactionStatus(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Transaction Status Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Transaction Status Error: context.response must be defined.`)

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/transaction_results/${ix.transaction.id}`,
    method: "GET",
    body: null
  })

  let ret = context.response()
  ret.tag = ix.tag
  ret.transactionStatus = {
    status: STATUS_MAP[res.status.toUpperCase()] || "", 
    statusString: res.status.toUpperCase(), 
    statusCode: 0, // TODO: Use field when it becomes available on HTTP Access API
    errorMessage: res.error_message,
    events: res.events.map(event => ({
      type: event.type,
      transactionId: event.transaction_id,
      transactionIndex: Number(event.transaction_index),
      eventIndex: Number(event.event_index),
      payload: JSON.parse(Buffer.from(event.payload, "base64").toString())
    }))
  }

  return ret
}
