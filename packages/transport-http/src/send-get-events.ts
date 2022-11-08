import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendGetEventsForHeightRangeRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/events?type=${ix.events.eventType}&start_height=${ix.events.start}&end_height=${ix.events.end}`,
    method: "GET",
    body: null,
  })

  return constructResponse(ix, context, res)
}

async function sendGetEventsForBlockIDsRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/events?type=${
      ix.events.eventType
    }&block_ids=${ix.events.blockIds.join(",")}`,
    method: "GET",
    body: null,
  })

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.events = []
  res.forEach(block =>
    block.events
      ? block.events.forEach(event =>
          ret.events.push({
            blockId: block.block_id,
            blockHeight: Number(block.block_height),
            blockTimestamp: block.block_timestamp,
            type: event.type,
            transactionId: event.transaction_id,
            transactionIndex: Number(event.transaction_index),
            eventIndex: Number(event.event_index),
            payload: JSON.parse(
              context.Buffer.from(event.payload, "base64").toString()
            ),
          })
        )
      : null
  )

  return ret
}

export async function sendGetEvents(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Events Error: opts.node must be defined.`)
  invariant(
    context.response,
    `SDK Send Get Events Error: context.response must be defined.`
  )
  invariant(
    context.Buffer,
    `SDK Send Get Events Error: context.Buffer must be defined.`
  )

  ix = await ix

  const interactionContainsBlockHeightRange = ix.events.start !== null
  const interactionContainsBlockIDsList =
    Array.isArray(ix.events.blockIds) && ix.events.blockIds.length > 0

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
