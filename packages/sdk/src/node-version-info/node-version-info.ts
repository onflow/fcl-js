import {NodeVersionInfo} from "@onflow/typedefs"
import {getNodeVersionInfo} from "../build/build-get-node-version-info"
import {decodeResponse as decode} from "../decode/decode"
import {send} from "../transport"

/**
 * @description Returns the version information from to connected node
 * @returns A promise that resolves to a block response
 */
export async function nodeVersionInfo(
  opts: any = {}
): Promise<NodeVersionInfo> {
  return send([getNodeVersionInfo()], opts).then(decode)
}
