import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetTransactionStatus(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transaction.id))

  const res = await unary(opts.node, AccessAPI.GetTransactionResult, req)

  let events = res.getEventsList()

  let ret = response()
  ret.tag = ix.tag
  ret.transactionStatus = {
    status: res.getStatus(),
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
