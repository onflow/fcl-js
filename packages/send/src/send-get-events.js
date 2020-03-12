import {GetEventsRequest, ObserveService} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendGetEvents(ix, opts = {}) {
  const req = new GetEventsRequest()
  req.setType(ix.eventType)
  req.setStartBlock(ix.startBlock)
  req.setEndBlock(ix.endBlock)

  const res = await unary(opts.node, ObserveService.GetEvents, req)

  let ret = response()
  ret.tag = ix.tag

  const events = res.getEventsList()
  ret.events = events.map(event => ({
    type: event.getType(),
    transactionHash: bufferToHexString(event.getTransactionHash_asU8()),
    index: event.getIndex(),
    payload: event.getPayload_asU8(),
  }))

  return ret
}
