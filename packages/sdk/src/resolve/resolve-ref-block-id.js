import {
  isTransaction,
  Ok,
  interaction,
  pipe,
} from "../interaction/interaction.js"
import * as ixModule from "../interaction/interaction.js"
import {response} from "../response/response.js"
import {config} from "@onflow/config"
import {decodeResponse} from "../decode/decode.js"
import {getBlock} from "../build/build-get-block.js"
import {Buffer} from "@onflow/rlp"
import {sendFn} from "../send/send-fn"

async function getRefId(opts) {
  var ix
  ix = await pipe(interaction(), [getBlock()])
  ix = await sendFn(ix, {config, response, Buffer, ix: ixModule})
  ix = await decodeResponse(ix)
  return ix.id
}

export function resolveRefBlockId(opts) {
  return async ix => {
    if (!isTransaction(ix)) return Ok(ix)
    if (ix.message.refBlock) return Ok(ix)

    ix.message.refBlock = await getRefId(opts)

    return Ok(ix)
  }
}
