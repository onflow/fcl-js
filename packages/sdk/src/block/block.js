import {send} from "../send/send.js"
import {getBlock} from "../build/build-get-block"
import {decodeResponse as decode} from "../decode/decode.js"
import {invariant} from "@onflow/util-invariant"
import {atBlockHeight, atBlockId} from "../sdk"

export function block({sealed = false, id, height} = {}) {
  invariant(
    !(id && height),
    `Cannot pass "id" and "height" simultaneously`
  )

  // Get block by ID
  if (id) return send([getBlock(sealed), atBlockId(id)]).then(decode)

  // Get block by height
  if (height) return send([getBlock(sealed), atBlockHeight(height)]).then(decode)

  // Get latest block
  return send([getBlock(sealed)]).then(decode)
}
