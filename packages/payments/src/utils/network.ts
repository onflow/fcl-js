import type {createFlowClientCore} from "@onflow/fcl-core"
import {FLOW_EVM_CHAIN_IDS, type FlowNetwork} from "../constants"

/**
 * Get the Flow EVM chain ID for the given Flow client
 *
 * @param flowClient - Flow client instance
 * @returns Flow EVM chain ID (747 for mainnet, 545 for testnet, 646 for local/emulator)
 * @throws {Error} If the network is not supported
 *
 * @example
 * ```typescript
 * const chainId = await getFlowEvmChainId(flowClient)
 * // Returns 747 for mainnet, 545 for testnet, 646 for local
 * ```
 */
export async function getFlowEvmChainId(
  flowClient: ReturnType<typeof createFlowClientCore>
): Promise<number> {
  const chainId = (await flowClient.getChainId()) as FlowNetwork
  const flowEvmChainId = FLOW_EVM_CHAIN_IDS[chainId]

  if (!flowEvmChainId) {
    throw new Error(
      `Unsupported Flow network: ${chainId}. ` +
        `Supported networks: ${Object.keys(FLOW_EVM_CHAIN_IDS).join(", ")}`
    )
  }

  return flowEvmChainId
}
