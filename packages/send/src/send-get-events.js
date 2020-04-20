import {GetEventsForHeightRangeRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")

export async function sendGetEvents(ix, opts = {}) {
  const req = new GetEventsForHeightRangeRequest()
  req.setType(ix.eventType)
  req.setStartHeight(Number(ix.bounds.start))
  req.setEndHeight(Number(ix.bounds.end))

  const res = await unary(opts.node, AccessAPI.GetEventsForHeightRange, req)

  let ret = response()
  ret.tag = ix.tag

  const results = res.getResultsList()
  ret.events = results.map(result => {
    const events = result.getEventsList()
    return {
      blockId: result.getBlockId(),
      blockHeight: result.getBlockHeight(),
      events: events.map(event => ({
        type: event.getType(),
        transactionId: u8ToHex(event.getTransactionId_asU8()),
        transactionIndex: event.getTransactionIndex(),
        eventIndex: event.getEventIndex(),
        payload: event.getPayload_asU8(),
      })),
    }
  })

  return ret
}
