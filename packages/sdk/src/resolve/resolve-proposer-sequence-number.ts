import {isTransaction, Ok} from "../interaction/interaction"
import * as ixModule from "../interaction/interaction"
import {response as responseModule} from "../response/response"
import {config} from "@onflow/config"
import {decodeResponse} from "../decode/decode"
import {getAccount} from "../build/build-get-account"
import {build} from "../build/build"
import {invariant} from "@onflow/util-invariant"
import {Buffer} from "@onflow/rlp"
import {send as defaultSend} from "@onflow/transport-http"
import {Interaction} from "@onflow/typedefs"

interface NodeConfig {
  node: string
}

/**
 * Resolves the sequence number for the proposer account by querying the blockchain.
 *
 * @param config Configuration containing the node endpoint
 * @returns A function that resolves the proposer sequence number for an interaction
 */
export const resolveProposerSequenceNumber =
  ({node}: NodeConfig) =>
  async (ix: Interaction) => {
    if (!isTransaction(ix)) return Ok(ix)
    if (ix.accounts[ix.proposer!].sequenceNum) return Ok(ix)

    const sendFn: any = await config.first(
      ["sdk.transport", "sdk.send"],
      defaultSend
    )

    invariant(
      sendFn,
      `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
    )

    const response = await sendFn(
      await build([getAccount(ix.accounts[ix.proposer!].addr!)]),
      {response: responseModule, Buffer, ix: ixModule},
      {node}
    )
    const decoded = await decodeResponse(response)

    ix.accounts[ix.proposer!].sequenceNum =
      decoded.keys[ix.accounts[ix.proposer!].keyId!].sequenceNumber

    return Ok(ix)
  }
