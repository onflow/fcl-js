import {GetEventsForHeightRangeRequest, GetEventsForBlockIDsRequest, AccessAPI} from "@onflow/protobuf"
import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendGetEventsForHeightRangeRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetEventsForHeightRangeRequest()
  req.setType(ix.events.eventType)

  req.setStartHeight(Number(ix.events.start))
  req.setEndHeight(Number(ix.events.end))

  const res = await unary(opts.node, AccessAPI.GetEventsForHeightRange, req)

  return constructResponse(ix, res)
}

async function sendGetEventsForBlockIDsRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetEventsForBlockIDsRequest()
  req.setType(ix.events.eventType)

  ix.events.blockIds.forEach(id =>
    req.addBlockIds(hexBuffer(id))
  )

  const res = await unary(opts.node, AccessAPI.GetEventsForBlockIDs, req)

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
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

export async function sendGetEvents(ix, opts = {}) {  
  ix = await ix

  const interactionContainsBlockHeightRange = ix.events.start !== null 
  const interactionContainsBlockIDsList = Array.isArray(ix.events.blockIds) && ix.events.blockIds.length > 0
 
  invariant(
    interactionContainsBlockHeightRange || interactionContainsBlockIDsList,
    "SendGetEventsError: Unable to determine which get events request to send. Either a block height range, or block IDs must be specified."
  )
  
  if (interactionContainsBlockHeightRange) {
    return await sendGetEventsForHeightRangeRequest(ix, opts)
  } else {
    return await sendGetEventsForBlockIDsRequest(ix, opts)
  }
}
