import {GetEventsForHeightRangeRequest, GetEventsForBlockIDsRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetEvents(ix, opts = {}) {
  const unary = opts.unary || defaultUnary
  
  ix = await ix
 
  let res
  const req = ix.events.start ? new GetEventsForHeightRangeRequest() : new GetEventsForBlockIDsRequest()
  req.setType(ix.events.eventType)
  
  if (ix.events.start) {
    req.setStartHeight(Number(ix.events.start))
    req.setEndHeight(Number(ix.events.end))

    res = await unary(opts.node, AccessAPI.GetEventsForHeightRange, req)
  } else {
    ix.events.blockIds.forEach(id =>
      req.addBlockIds(hexBuffer(id))
    )

    res = await unary(opts.node, AccessAPI.GetEventsForBlockIDs, req)
  }

  let ret = response()
  ret.tag = ix.tag

  const results = res.getResultsList()
  ret.events = results.reduce((blocks, result) => {
    const blockId = u8ToHex(result.getBlockId_asU8())
    const blockHeight = result.getBlockHeight()
    const blockTimestamp = result.getBlockTimestamp().toDate().toISOString()
    const events = result.getEventsList()
    events.forEach(event => {
      blocks.push({
        blockId,
        blockHeight,
        blockTimestamp,
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
