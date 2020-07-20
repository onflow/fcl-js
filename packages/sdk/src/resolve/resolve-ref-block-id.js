import {isTransaction, isScript, Ok, Bad} from "@onflow/interaction"
import { send, pipe, build, getLatestBlock, decodeResponse } from "../sdk.js"

export const resolveRefBlockId = ({ node }) => async (ix) => {
    if (!(isTransaction(ix))) return Ok(ix)
    if (ix.message.refBlock) return Ok(ix)

    const response = await send(await pipe(await build([
        getLatestBlock()
    ])), { node })
    const decoded = await decodeResponse(response)

    ix.message.refBlock = decoded.id

    return Ok(ix)
}
