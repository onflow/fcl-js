import {invariant} from "@onflow/util-invariant"
import {GetCollectionByIDRequest, AccessAPI} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetCollection(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Collection Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Collection Error: context.response must be defined.`)

  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetCollectionByIDRequest()
  req.setId(hexBuffer(ix.collection.id))

  const res = await unary(opts.node, AccessAPI.GetCollectionByID, req, context)

  const collection = res.getCollection()

  const ret = context.response()
  ret.tag = ix.tag
  ret.collection = {
    id: u8ToHex(collection.getId_asU8()),
    transactionIds: (collection.getTransactionIdsList()).map(u8ToHex)
  }

  return ret
}
