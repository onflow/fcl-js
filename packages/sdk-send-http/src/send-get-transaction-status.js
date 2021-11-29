import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

const STATUS_MAP = {
  '0': 'UNKNOWN',
  '1': 'PENDING',
  '2': 'FINALIZED',
  '3': 'EXECUTED',
  '4': 'SEALED',
  '5': 'EXPIRED'
}

const convertStatusToString = code => {
  if (code == null) return
  return STATUS_MAP[String(code)]
}

export async function sendGetTransactionStatus(ix, opts = {}) {
  invariant(opts.node, `SDK Send Get Transaction Status Error: opts.node must be defined.`)

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  const res = await httpRequest({
    hostname: opts.node,
    path: `/transaction_results?height=${ix.transaction.id}`,
    method: "GET",
    body: null
  })

  let ret = response()
  ret.tag = ix.tag
  ret.transactionStatus = {
    blockId: res.block_id, // THIS IS A NEW FIELD FROM REST API
    status: res.status, // THIS IS NOW A STRING IN REST API LIKE "Pending"
    statusString: null, // MAYBE SHOULD BE CONVERTED FROM res.status field
    statusCode: null, // MAYBE SHOULD BE CONVERTED FROM res.status field 
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
