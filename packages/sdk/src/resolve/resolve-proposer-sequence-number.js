import {isTransaction, Ok} from "@onflow/interaction"
import {send} from "@onflow/send"
import {decodeResponse} from "@onflow/decode"
import {build} from "../build"
import {getAccount} from "../build/get-account"

export const resolveProposerSequenceNumber = ({ node }) => async (ix) => {
    if (!(isTransaction(ix))) return Ok(ix)
    if (ix.accounts[ix.proposer].sequenceNum) return Ok(ix)

    const response = await send(await build([
        getAccount(ix.accounts[ix.proposer].addr)
      ]), { node })
    const decoded = await decodeResponse(response)

    ix.accounts[ix.proposer].sequenceNum = decoded.keys[ix.accounts[ix.proposer].keyId].sequenceNumber

    return Ok(ix)
}
