const RLP = require("rlp")
import {isTransaction, pipe, get, update} from "@onflow/interaction"
import {
  addressToBuffer,
  scriptToBuffer,
  hashToBuffer,
  bytes,
} from "@onflow/bytes"

export const resolvePayload = pipe([
  update("tx.payload", (payload, ix) => {
    if (!isTransaction(ix)) return null

    const code = ix.payload.code
    const ref = ix.payload.ref
    const nonce = ix.payload.nonce
    const limit = ix.payload.limit
    const payer = get(ix, "tx.payer")
    const authorizations = get(ix, "tx.authorizations")

    const rlpEncoded = RLP.encode([
      scriptToBuffer(code),
      ref ? hashToBuffer(ref) : null,
      nonce,
      limit,
      addressToBuffer(bytes(payer.acct, 20)),
      authorizations.map((a) => addressToBuffer(bytes(a.acct, 20))),
    ])

    return {
      rlpEncoded,
      code,
      ref,
      nonce,
      limit,
      ...payload,
    }
  }),
])
