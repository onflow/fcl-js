import {invariant} from "@onflow/util-invariant"
import {subscribeWs as defaultSubscribeWs} from "./subscribe-ws"

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

function constructResponse(ix, context, callback) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.unsubscribeCallback = callback

  return ret
}

export async function sendSubscribeEvents(ix, context = {}, opts = {}) {
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

  const subscribeWs = opts.subscribeWs || defaultSubscribeWs
  const {onData, onError, onComplete} = ix.subscription

  const unsubscribe = subscribeWs({
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
    onData: handleData,
    onError,
    onComplete,
  })

  function handleData(data) {
    const resp = constructData(ix, context, data)
    onData(resp)
  }

  return constructResponse(ix, context, unsubscribe)
}
