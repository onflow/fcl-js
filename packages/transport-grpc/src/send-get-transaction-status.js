import {invariant} from "@onflow/util-invariant"
import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const STATUS_MAP = {
  0: "UNKNOWN",
  1: "PENDING",
  2: "FINALIZED",
  3: "EXECUTED",
  4: "SEALED",
  5: "EXPIRED"
}

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetTransactionStatus(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Transaction Status Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Transaction Status Error: context.response must be defined.`)

  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transaction.id))

  const res = await unary(opts.node, AccessAPI.GetTransactionResult, req, context)

  let events = res.getEventsList()

  let ret = context.response()
  ret.tag = ix.tag
  ret.transactionStatus = {
    status: res.getStatus(),
    statusString: STATUS_MAP[res.getStatus()],
    statusCode: res.getStatusCode(),
    errorMessage: res.getErrorMessage(),
    events: events.map(event => ({
      type: event.getType(),
      transactionId: u8ToHex(event.getTransactionId_asU8()),
      transactionIndex: event.getTransactionIndex(),
      eventIndex: event.getEventIndex(),
      payload: JSON.parse(Buffer.from(event.getPayload_asU8()).toString("utf8")),
    })),
  }

  return ret
}
