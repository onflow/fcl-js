import * as sdk from "@onflow/sdk"

/**
 * @description Fetches the chain ID from the Flow network by querying the network parameters.
 * The chain ID is a unique identifier for the specific Flow network (mainnet, testnet, etc.)
 * and is essential for ensuring transactions are executed on the correct network.
 *
 * @param opts Optional configuration object that can contain network access settings and other parameters
 * @returns Promise that resolves to the chain ID string (e.g., "flow-mainnet", "flow-testnet")
 *
 * @example
 * // Fetch chain ID from the configured network
 * const chainId = await fetchChainId()
 * console.log(chainId) // "flow-mainnet" or "flow-testnet"
 */
export async function fetchChainId(
  opts: Record<string, any> = {}
): Promise<string> {
  const response = await sdk
    .send([sdk.getNetworkParameters()], opts)
    .then(sdk.decode)
  return response.chainId
}
