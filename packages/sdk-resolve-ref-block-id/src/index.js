import {isTransaction, Ok, interaction, pipe} from "@onflow/interaction"
import {send} from "@onflow/send"
import {decodeResponse} from "@onflow/decode"
import {getLatestBlock} from "@onflow/sdk-build-get-latest-block"

async function getRefId (opts) {
  var ix
  ix = await pipe(interaction(), [getLatestBlock()])
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
