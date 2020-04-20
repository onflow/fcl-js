import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString, hashToBuffer} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendGetTransactionStatus(ix, opts = {}) {
  const req = new GetTransactionRequest()
  req.setId(hashToBuffer(ix.txId))

  const res = await unary(opts.node, AccessAPI.GetTransactionResult, req)

  let events = res.getEventsList()

  let ret = response()
  ret.tag = ix.tag
  ret.transaction = {
    status: res.getStatus(),
    statusCode: res.getStatusCode(),
    errorMessage: res.getErrorMessage(),
    events: events.map(event => ({
      type: event.getType(),
      transactionId: bufferToHexString(event.getTransactionId_asU8()),
      transactionIndex: event.getTransactionIndex(),
      eventIndex: event.getEventIndex(),
      payload: event.getPayload_asU8(),
    })),
  }

  return ret
}
