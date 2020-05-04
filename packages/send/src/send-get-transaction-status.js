import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetTransactionStatus(ix, opts = {}) {
  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transactionId))

  const res = await unary(opts.node, AccessAPI.GetTransactionResult, req)

  let events = res.getEventsList()

  let ret = response()
  ret.tag = ix.tag
  ret.transaction = {
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
