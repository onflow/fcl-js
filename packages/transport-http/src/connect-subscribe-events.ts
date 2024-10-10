import {invariant} from "@onflow/util-invariant"
import {connectWs as defaultConnectWs} from "./connect-ws"
import {EventEmitter} from "events"
import {BlockHeartbeat, Interaction, StreamConnection} from "@onflow/typedefs"

type RawSubscribeEventsStream = StreamConnection<{
  data: {
    events: any[]
    heartbeat: BlockHeartbeat
  }
}>

function constructData(ix: Interaction, context: any, data: any) {
  const response = context.response()
  response.tag = ix.tag

  response.events =
    data.Events?.length > 0
      ? data.Events.map((event: any) => ({
          blockId: data.BlockID,
          blockHeight: Number(data.Height),
          blockTimestamp: data.BlockTimestamp,
          type: event.Type,
          transactionId: event.TransactionID,
          transactionIndex: Number(event.TransactionIndex),
          eventIndex: Number(event.EventIndex),
          payload: JSON.parse(
            context.Buffer.from(event.Payload, "base64").toString()
          ),
        }))
      : null
  response.heartbeat = {
    blockId: data.BlockID,
    blockHeight: Number(data.Height),
    blockTimestamp: data.BlockTimestamp,
  }

  return response
}

function constructResponse(ix: Interaction, context: any, stream: any) {
  const response = context.response()
  response.tag = ix.tag

  response.streamConnection = stream

  return response
}

export async function connectSubscribeEvents(
  ix: Interaction | Promise<Interaction>,
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

  const resolvedIx = await ix

  const connectWs: typeof defaultConnectWs = opts.connectWs || defaultConnectWs
  const outputEmitter = new EventEmitter()
  let lastBlockHeight: string | null = null

  // Connect to the websocket & provide reconnection parameters
  const connection = connectWs<any>({
    hostname: opts.node,
    path: `/v1/subscribe_events`,
    getParams: () => {
      const params: Record<string, any> = {
        event_types: resolvedIx.subscribeEvents?.eventTypes,
        addresses: resolvedIx.subscribeEvents?.addresses,
        contracts: resolvedIx.subscribeEvents?.contracts,
        heartbeat_interval: resolvedIx.subscribeEvents?.heartbeatInterval,
      }

      // If the lastBlockId is set, use it to resume the stream
      if (lastBlockHeight) {
        params.start_height = lastBlockHeight + 1
      } else {
        params.start_block_id = resolvedIx.subscribeEvents?.startBlockId
        params.start_height = resolvedIx.subscribeEvents?.startHeight
      }

      return params
    },
  })

  // Map the connection to a formatted response stream
  connection.on("data", (data: any) => {
    const responseData = constructData(resolvedIx, context, data)
    lastBlockHeight = responseData.heartbeat.blockHeight
    outputEmitter.emit("data", responseData)
  })
  connection.on("error", (error: Error) => {
    outputEmitter.emit("error", error)
  })
  connection.on("close", () => {
    outputEmitter.emit("close")
  })

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
      connection.close()
    },
  }
  return constructResponse(resolvedIx, context, responseStream)
}
