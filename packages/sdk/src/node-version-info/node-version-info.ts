import {send} from "../send/send.js"
import {decodeResponse as decode} from "../decode/decode.js"
import {getNodeVersionInfo} from "../build/build-get-node-version-info"
import {NodeVersionInfo} from "@onflow/typedefs"

/**
 * @description Returns the version information from to connected node
 * @returns A promise that resolves to a block response
 */
export async function nodeVersionInfo(
  opts: any = {}
): Promise<NodeVersionInfo> {
  return send([getNodeVersionInfo()], opts).then(decode)
}
