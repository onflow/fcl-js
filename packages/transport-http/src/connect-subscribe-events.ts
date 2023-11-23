import {invariant} from "@onflow/util-invariant"
import {connectWs as defaultConnectWs} from "./connect-ws"
import {EventEmitter} from "events"
import {StreamConnection} from "@onflow/typedefs"

type RawSubscribeEventsStream = StreamConnection<{
  data: {
    events: any[]
    heartbeat: {
      blockId: string
      blockHeight: number
      blockTimestamp: number
    }
  }
}>

function constructData(ix: any, context: any, data: any) {
  // TODO REMOVE ME
  // DUMMY PAYLOAD UNTIL ACCESS NODE BUG IS FIXED
  if (data.Events) {
    data.Events = data.Events.map((event: any) => ({
      ...event,
      Payload:
        "eyJ2YWx1ZSI6eyJpZCI6IkEuOTEyZDU0NDBmN2UzNzY5ZS5GbG93RmVlcy5GZWVzRGVkdWN0ZWQiLCJmaWVsZHMiOlt7InZhbHVlIjp7InZhbHVlIjoiMC4wMDAwMDExOSIsInR5cGUiOiJVRml4NjQifSwibmFtZSI6ImFtb3VudCJ9LHsidmFsdWUiOnsidmFsdWUiOiIxLjAwMDAwMDAwIiwidHlwZSI6IlVGaXg2NCJ9LCJuYW1lIjoiaW5jbHVzaW9uRWZmb3J0In0seyJ2YWx1ZSI6eyJ2YWx1ZSI6IjAuMDAwMDAwMDQiLCJ0eXBlIjoiVUZpeDY0In0sIm5hbWUiOiJleGVjdXRpb25FZmZvcnQifV19LCJ0eXBlIjoiRXZlbnQifQo=",
    }))
  }

  let ret = context.response()
  ret.tag = ix.tag

  ret.events =
    data.Events?.length > 0
      ? data.Events.map((event: any) => ({
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
      : null
  ret.heartbeat = {
    blockId: data.BlockID,
    blockHeight: Number(data.Height),
    blockTimestamp: data.Timestamp,
  }

  return ret
}

function constructResponse(ix: any, context: any, stream: any) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.dataStream = stream

  return ret
}

export async function connectSubscribeEvents(
  ix: any,
  context: any = {},
  opts: any = {}
) {
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

  const connectWs: typeof defaultConnectWs = opts.connectWs || defaultConnectWs
  const outputEmitter = new EventEmitter()
  let close = () => {}
  let lastBlockId: string | null = null

  ;(function connect() {
    const params: Record<string, any> = {
      event_types: ix.subscribeEvents.eventTypes,
      addresses: ix.subscribeEvents.addresses,
      contracts: ix.subscribeEvents.contracts,
      heartbeat_interval: ix.subscribeEvents.heartbeatInterval,
    }

    // If the lastBlockId is set, use it to resume the stream
    if (lastBlockId) {
      params.start_block_id = lastBlockId
    } else {
      params.start_block_id = ix.subscribeEvents.startBlockId
      params.start_height = ix.subscribeEvents.startHeight
    }

    // Connect to the websocket
    const connection = connectWs<any>({
      hostname: opts.node,
      path: `/v1/subscribe_events`,
      params,
    })

    // Map the connection to a formatted response stream
    connection.on("data", (data: any) => {
      const responseData = constructData(ix, context, data)
      lastBlockId = responseData.heartbeat.blockId
      outputEmitter.emit("data", responseData)
    })
    connection.on("error", (error: Error) => {
      outputEmitter.emit("error", error)
    })
    connection.on("close", () => {
      connect()
    })
    connection.on("open", () => {
      outputEmitter.emit("open")
    })
    close = () => connection.close()
  })()

  const responseStream: RawSubscribeEventsStream = {
    on(event: "data" | "error" | "close" | "open", listener: any) {
      outputEmitter.on(event, listener)
      return this
    },
    off(event: "data" | "error" | "close" | "open", listener: any) {
      outputEmitter.off(event, listener)
      return this
    },
    close() {
      close()
    },
  }
  return constructResponse(ix, context, responseStream)
}
