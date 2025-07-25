import {
  pipe,
  makeGetNetworkParameters,
  Ok,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get network parameters.
 *
 * Network parameters contain important configuration information about the Flow network,
 * including the chain ID, which is essential for signing transactions correctly.
 * This information is crucial for ensuring transactions are submitted to the correct network.
 *
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get network parameters to verify chain ID
 * const params = await fcl.send([
 *   fcl.getNetworkParameters()
 * ]).then(fcl.decode);
 *
 * console.log("Chain ID:", params.chainId);
 * console.log("Network:", params.name);
 *
 * // Use this to verify you're connected to the right network
 * if (params.chainId === "flow-mainnet") {
 *   console.log("Connected to Flow Mainnet");
 * } else if (params.chainId === "flow-testnet") {
 *   console.log("Connected to Flow Testnet");
 * }
 */
export function getNetworkParameters(): InteractionBuilderFn {
  return pipe([
    makeGetNetworkParameters,
    ix => {
      return Ok(ix)
    },
  ])
}
