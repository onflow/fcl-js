import {invariant} from "@onflow/util-invariant"
import {GetEventsForHeightRangeRequest, GetEventsForBlockIDsRequest, AccessAPI} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendGetEventsForHeightRangeRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetEventsForHeightRangeRequest()
  req.setType(ix.events.eventType)

  req.setStartHeight(Number(ix.events.start))
  req.setEndHeight(Number(ix.events.end))

  const res = await unary(opts.node, AccessAPI.GetEventsForHeightRange, req, context)

  return constructResponse(ix, context, res)
}

async function sendGetEventsForBlockIDsRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetEventsForBlockIDsRequest()
  req.setType(ix.events.eventType)

  ix.events.blockIds.forEach(id =>
    req.addBlockIds(hexBuffer(id))
  )

  const res = await unary(opts.node, AccessAPI.GetEventsForBlockIDs, req, context)

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  let ret = context.response()
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

export async function sendGetEvents(ix, context = {}, opts = {}) {  
  invariant(opts.node, `SDK Send Get Events Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Events Error: context.response must be defined.`)

  ix = await ix

  const interactionContainsBlockHeightRange = ix.events.start !== null 
  const interactionContainsBlockIDsList = Array.isArray(ix.events.blockIds) && ix.events.blockIds.length > 0
 
  invariant(
    interactionContainsBlockHeightRange || interactionContainsBlockIDsList,
    "SendGetEventsError: Unable to determine which get events request to send. Either a block height range, or block IDs must be specified."
  )
  
  if (interactionContainsBlockHeightRange) {
    return await sendGetEventsForHeightRangeRequest(ix, context, opts)
  } else {
    return await sendGetEventsForBlockIDsRequest(ix, context, opts)
  }
}
