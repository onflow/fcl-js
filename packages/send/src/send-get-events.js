import {GetEventsForHeightRangeRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")

export async function sendGetEvents(ix, opts = {}) {
  const req = new GetEventsForHeightRangeRequest()
  req.setType(ix.events.eventType)
  req.setStartHeight(Number(ix.events.start))
  req.setEndHeight(Number(ix.events.end))

  const res = await unary(opts.node, AccessAPI.GetEventsForHeightRange, req)

  let ret = response()
  ret.tag = ix.tag

  const results = res.getResultsList()
  ret.events = results.reduce((blocks, result) => {
    const blockId = result.getBlockId()
    const blockHeight = result.getBlockHeight()
    const events = result.getEventsList()
    events.forEach(event => {
      blocks.push({
        blockId,
        blockHeight,
        type: event.getType(),
        transactionId: u8ToHex(event.getTransactionId_asU8()),
        transactionIndex: event.getTransactionIndex(),
        eventIndex: event.getEventIndex(),
        payload: JSON.parse(Buffer.from(event.getPayload_asU8()).toString("utf8")),
      })
    })
    return blocks
  }, [])

  return ret
}
