import {invariant} from "@onflow/util-invariant"
import {connectWs as defaultConnectWs} from "./connect-ws"

function constructData(ix, context, data) {
  // TODO REMOVE ME
  // DUMMY PAYLOAD UNTIL ACCESS NODE BUG IS FIXED
  if (data.Events) {
    data.Events = data.Events.map(event => ({
      ...event,
      Payload:
        "eyJ2YWx1ZSI6eyJpZCI6IkEuOTEyZDU0NDBmN2UzNzY5ZS5GbG93RmVlcy5GZWVzRGVkdWN0ZWQiLCJmaWVsZHMiOlt7InZhbHVlIjp7InZhbHVlIjoiMC4wMDAwMDExOSIsInR5cGUiOiJVRml4NjQifSwibmFtZSI6ImFtb3VudCJ9LHsidmFsdWUiOnsidmFsdWUiOiIxLjAwMDAwMDAwIiwidHlwZSI6IlVGaXg2NCJ9LCJuYW1lIjoiaW5jbHVzaW9uRWZmb3J0In0seyJ2YWx1ZSI6eyJ2YWx1ZSI6IjAuMDAwMDAwMDQiLCJ0eXBlIjoiVUZpeDY0In0sIm5hbWUiOiJleGVjdXRpb25FZmZvcnQifV19LCJ0eXBlIjoiRXZlbnQifQo=",
    }))
  }

  let ret = context.response()
  ret.tag = ix.tag

  ret.events = data.Events
    ? data.Events.map(event => ({
        blockId: data.BlockID,
        blockHeight: Number(data.Height),
        blockTimestamp: data.Timestamp,
        type: event.Type,
        transactionId: event.TransactionID,
        transactionIndex: Number(event.TransactionIndex),
        eventIndex: Number(event.EventIndex),
        payload: JSON.parse(
          context.Buffer.from(event.Payload, "base64").toString()
        ),
      }))
    : []

  return ret
}

function constructResponse(ix, context, stream) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.dataStream = stream

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
  const dataStream = socketStream.map(data => constructData(ix, context, data))

  return constructResponse(ix, context, dataStream)
}
