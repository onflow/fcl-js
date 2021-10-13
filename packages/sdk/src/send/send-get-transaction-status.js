import {invariant} from "@onflow/util-invariant"
import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const STATUS_MAP = {
  '0': 'UNKNOWN',
  '1': 'PENDING',
  '2': 'FINALIZED',
  '3': 'EXECUTED',
  '4': 'SEALED',
  '5': 'EXPIRED'
}

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

const convertStatusToString = code => {
  if (code == null) return
  return STATUS_MAP[String(code)]
}

export async function sendGetTransactionStatus(ix, opts = {}) {
  invariant(opts.node, `SDK Send Get Transaction Status Error: opts.node must be defined.`)

  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transaction.id))

  const res = await unary(opts.node, AccessAPI.GetTransactionResult, req)

  let events = res.getEventsList()

  let ret = response()
  const status = res.getStatus()
  ret.tag = ix.tag
  ret.transactionStatus = {
    status: status,
    statusString: convertStatusToString(status),
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
