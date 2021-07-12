import {GetEventsForHeightRangeRequest, GetEventsForBlockIDsRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")
const isHeightRangeRequest = ix => "start" in ix.events
const isBlockIdsRequest = ix => "blockIds" in ix.events

async function getEventsForHeightRange(eventType, start, end, opts, tag) {
  const unary = opts.unary || defaultUnary

  const req = new GetEventsForHeightRangeRequest()

  req.setType(eventType)
  req.setStartHeight(start)
  req.setEndHeight(end)

  const res = unary(opts.node, AccessAPI.GetEventsForHeightRange, req)

  return formatResponse(res, tag)
}

async function getEventsForBlockIDs(eventType, blockIds, opts, tag) {
  const unary = opts.unary || defaultUnary

  const req = new GetEventsForBlockIDsRequest()

  req.setType(eventType)

  blockIds.forEach(id =>
    req.addBlockIds(hexBuffer(id))
  )

  const res = await unary(opts.node, AccessAPI.GetEventsForBlockIDs, req)

  return formatResponse(res, tag)
}

function formatResponse(res, tag) {
  const ret = response()
  ret.tag = tag

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

export async function sendGetEvents(ix, opts = {}) {  
  ix = await ix
 
  if (isHeightRangeRequest(ix)) {
    return getEventsForHeightRange(
      ix.events.eventType,
      Number(ix.events.start),
      Number(ix.events.end),
      opts,
      ix.tag,
    )
  }

  if (isBlockIdsRequest(ix)) {
    return getEventsForBlockIDs(
      ix.events.eventType,
      ix.events.blockIds,
      opts,
      ix.tag,
    )
  }

  throw new Error("Invalid event query, must specify height range or block IDs")
}
