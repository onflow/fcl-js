import {isTransaction, Ok} from "../interaction/interaction.js"
import {send} from "../send/sdk-send.js"
import {decodeResponse} from "../decode/decode.js"
import {getAccount} from "../build/build-get-account.js"
import {build} from "../build/build.js"

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
