import {invariant} from "@onflow/util-invariant"
import {connectWs as defaultConnectWs} from "./connect-ws"

function constructData(ix, context, data) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.events = data.events
    ? data.events.map(event => ({
        blockId: data.BlockId,
        blockHeight: Number(data.Height),
        blockTimestamp: data.Timestamp,
        type: event.Type,
        transactionId: event.TransactionId,
        transactionIndex: Number(event.TransactionIndex),
        eventIndex: Number(event.EventIndex),
        payload: JSON.parse(
          context.Buffer.from(event.Payload, "base64").toString()
        ),
      }))
    : []

  return ret
}

export async function connectSubscribeEvents(ix, context = {}, opts = {}) {
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

  const connectWs = opts.connectWs || defaultConnectWs

  const socketStream = connectWs({
    hostname: opts.node,
    path: `/v1/subscribe_events`,
    params: {
      start_block_id: ix.subscribeEvents.startBlockId,
      start_height: ix.subscribeEvents.startHeight,
      event_types: ix.subscribeEvents.eventTypes,
      addresses: ix.subscribeEvents.addresses,
      contracts: ix.subscribeEvents.contracts,
      heartbeat_interval: ix.subscribeEvents.heartbeatInterval,
    },
  })

  // Map the data to the response object
  return socketStream.map(data => constructData(ix, context, data))
}
