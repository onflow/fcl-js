import {NodeVersionInfo} from "@onflow/typedefs"
import {getNodeVersionInfo} from "../build/build-get-node-version-info"
import {decodeResponse as decode} from "../decode/decode"
import {send} from "../transport"

/**
 * Retrieve version information from the connected Flow Access Node.
 *
 * This function returns detailed information about the Flow node's version, including the protocol version, spork information, and node-specific details. This is useful for debugging, compatibility checks, and understanding the network state.
 *
 * @param opts Optional parameters for the request
 * @returns A promise that resolves to a block response
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get node version information
 * const versionInfo = await fcl.nodeVersionInfo();
 * console.log(versionInfo);
 * // {
 * //   semver: "v0.37.13",
 * //   commit: "12345abcd",
 * //   spork_id: "mainnet-23",
 * //   protocol_version: "2.13.10",
 * //   spork_root_block_height: "88483760",
 * //   node_root_block_height: "88483760"
 * // }
 *
 * // Check compatibility
 * const info = await fcl.nodeVersionInfo();
 * if (info.protocol_version.startsWith("2.13")) {
 *   console.log("Compatible with current protocol version");
 * }
 */
export async function nodeVersionInfo(
  opts: any = {}
): Promise<NodeVersionInfo> {
  return await send([getNodeVersionInfo()], opts).then(decode)
}
