import {send} from "../send/send.js"
import {decodeResponse as decode} from "../decode/decode.js"
import {getNodeVersionInfo} from "../build/build-get-node-version-info"
import {NodeVersionInfo, Interaction} from "@onflow/typedefs"

/**
 * @description Returns the version information from to connected node
 * @returns A promise that resolves to a block response
 */
export async function nodeVersionInfo(
  opts: any = {}
): Promise<NodeVersionInfo> {
  const ix = await send(
    [getNodeVersionInfo() as unknown as (ix: Interaction) => Interaction],
    opts
  )
  return decode(ix)
}
