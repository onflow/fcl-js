import {isTransaction, Ok} from "@onflow/interaction"
import {send} from "@onflow/send"
import {decodeResponse} from "@onflow/decode"
import {build} from "../build"
import {getLatestBlock} from "../build/get-latest-block"

export const resolveRefBlockId = ({ node }) => async (ix) => {
    if (!(isTransaction(ix))) return Ok(ix)
    if (ix.message.refBlock) return Ok(ix)

    const response = await send(await build([
        getLatestBlock()
    ]), { node })
    const decoded = await decodeResponse(response)

    ix.message.refBlock = decoded.id

    return Ok(ix)
}
