import {send} from "../send/send.js"
import {getBlock} from "../build/build-get-block"
import {atBlockHeight} from "../build/build-at-block-height.js"
import {atBlockId} from "../build/build-at-block-id.js"
import {decodeResponse as decode} from "../decode/decode.js"
import {invariant} from "@onflow/util-invariant"

export function block({sealed = false, id, height} = {}, opts = {}) {
  invariant(
    !((sealed && id) || (sealed && height)),
    `Method: block -- Cannot pass "sealed" with "id" or "height"`
  )

  invariant(
    !(id && height),
    `Method: block -- Cannot pass "id" and "height" simultaneously`
  )

  // Get block by ID
  if (id) return send([getBlock(), atBlockId(id)], opts).then(decode)

  // Get block by height
  if (height) return send([getBlock(), atBlockHeight(height)], opts).then(decode)

  // Get latest block
  return send([getBlock(sealed)], opts).then(decode)
}
