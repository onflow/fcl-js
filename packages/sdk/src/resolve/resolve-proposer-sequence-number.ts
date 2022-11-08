import {isTransaction, Ok} from "../interaction/interaction.js"
import * as ixModule from "../interaction/interaction.js"
import {response as responseModule} from "../response/response.js"
import {config} from "@onflow/config"
import {decodeResponse} from "../decode/decode.js"
import {getAccount} from "../build/build-get-account.js"
import {build} from "../build/build.js"
import {invariant} from "@onflow/util-invariant"
import {Buffer} from "@onflow/rlp"
import {send as defaultSend} from "@onflow/transport-http"

export const resolveProposerSequenceNumber =
  ({node}) =>
  async ix => {
    if (!isTransaction(ix)) return Ok(ix)
    if (ix.accounts[ix.proposer].sequenceNum) return Ok(ix)

    const sendFn = await config.first(
      ["sdk.transport", "sdk.send"],
      defaultSend
    )

    invariant(
      sendFn,
      `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
    )

    const response = await sendFn(
      await build([getAccount(ix.accounts[ix.proposer].addr)]),
      {config, response: responseModule, Buffer, ix: ixModule},
      {node}
    )
    const decoded = await decodeResponse(response)

    ix.accounts[ix.proposer].sequenceNum =
      decoded.keys[ix.accounts[ix.proposer].keyId].sequenceNumber

    return Ok(ix)
  }
