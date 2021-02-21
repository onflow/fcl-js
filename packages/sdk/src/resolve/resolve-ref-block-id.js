import {isTransaction, Ok, interaction, pipe} from "../interaction/interaction.js"
import {send} from "../send/sdk-send.js"
import {decodeResponse} from "../decode/decode.js"
import {getBlock} from "../build/build-get-block.js"

async function getRefId (opts) {
  var ix
  ix = await pipe(interaction(), [getBlock()])
  ix = await send(ix, opts)
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
