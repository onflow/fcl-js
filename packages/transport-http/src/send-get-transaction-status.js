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
    path: `/transaction_results?height=${ix.transaction.id}`,
    method: "GET",
    body: null
  })

  let ret = context.response()
  ret.tag = ix.tag
  ret.transactionStatus = {
    blockId: res.block_id, // THIS IS A NEW FIELD FROM REST API
    status: STATUS_MAP[res.status.toUpperCase()], // THIS IS NOW A STRING IN REST API LIKE "Pending"
    statusString: res.status.toUpperCase(), // MAYBE SHOULD BE CONVERTED FROM res.status field
    events: res.events.map(event => ({
      type: event.type,
      transactionId: event.transaction_id,
      transactionIndex: event.transaction_index,
      eventIndex: event.event_index,
      payload: event.payload
    }))
  }

  return ret
}
