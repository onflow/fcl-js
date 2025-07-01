import {
  Ok,
  makeGetNodeVerionInfo,
  pipe,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function for the Get Node Version Info interaction.
 *
 * Creates an interaction to retrieve version information from the connected Flow Access Node.
 * This includes details about the node's software version, protocol version, and spork information.
 *
 * Consider using the pre-built interaction 'fcl.nodeVersionInfo()' if you do not need to pair with any other builders.
 *
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get node version information using builder
 * const versionInfo = await fcl.send([
 *   fcl.getNodeVersionInfo()
 * ]).then(fcl.decode);
 *
 * console.log("Node version:", versionInfo.semver);
 * console.log("Protocol version:", versionInfo.protocol_version);
 * console.log("Spork ID:", versionInfo.spork_id);
 *
 * // Use with other builders if needed
 * const interaction = await fcl.build([
 *   fcl.getNodeVersionInfo()
 *   // other builders can be added here
 * ]);
 */
export function getNodeVersionInfo(): InteractionBuilderFn {
  return pipe([
    makeGetNodeVerionInfo,
    ix => {
      return Ok(ix)
    },
  ])
}
