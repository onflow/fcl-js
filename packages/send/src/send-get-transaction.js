import {ObserveService, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendGetTransaction(ix, opts = {}) {
  const req = new GetTransactionRequest()
  req.setHash(ix.hash)

  const res = await unary(opts.node, ObserveService.GetTransaction, req)

  let transaction = res.getTransaction()
  let events = res.getEventsList()

  let ret = response()
  ret.tag = ix.tag
  ret.transaction = {
    status: transaction.getStatus(),
    events: events.map(event => ({
      type: event.getType(),
      transactionHash: bufferToHexString(event.getTransactionHash_asU8()),
      index: event.getIndex(),
      payload: event.getPayload_asU8(),
    })),
  }

  return ret
}
