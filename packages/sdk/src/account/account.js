import {atBlockHeight} from "../build/build-at-block-height.js"
import {atBlockId} from "../build/build-at-block-id.js"
import {getAccount} from "../build/build-get-account.js"
import {invariant} from "@onflow/util-invariant"
import {decodeResponse as decode} from "../decode/decode.js"
import {send} from "../send/send.js"

export function account(address, {height, id} = {}, opts) {
  invariant(
    !(id && height),
    `Method: account -- Cannot pass "id" and "height" simultaneously`
  )

  // Get account by ID
  if (id) return send([getAccount(address), atBlockId(id)], opts).then(decode)

  // Get account by height
  if (height)
    return send([getAccount(address), atBlockHeight(height)], opts).then(decode)

  return send([getAccount(address)], opts).then(decode)
}
