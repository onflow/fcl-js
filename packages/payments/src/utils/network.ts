import type {createFlowClientCore} from "@onflow/fcl-core"
import {FLOW_EVM_CHAIN_IDS, type FlowNetwork} from "../constants"

/**
 * Convert Flow chain ID to Flow network name
 *
 * @param chainId - Flow chain ID (e.g., "flow-mainnet", "flow-testnet")
 * @returns Flow network name ("mainnet", "testnet", "emulator")
 *
 * @example
 * ```typescript
 * getFlowNetwork("flow-mainnet") // "mainnet"
 * getFlowNetwork("flow-local") // "emulator"
 * ```
 */
export function getFlowNetwork(chainId: string): FlowNetwork {
  const n = chainId.replace(/^flow-/, "").toLowerCase()
  return n === "local" ? "emulator" : (n as FlowNetwork)
}

/**
 * Get the Flow EVM chain ID for the given Flow client
 *
 * @param flowClient - Flow client instance
 * @returns Flow EVM chain ID (747 for mainnet, 545 for testnet, 646 for emulator)
 * @throws {Error} If the network is not supported
 *
 * @example
 * ```typescript
 * const chainId = await getFlowEvmChainId(flowClient)
 * // Returns 747 for mainnet, 545 for testnet, 646 for emulator
 * ```
 */
export async function getFlowEvmChainId(
  flowClient: ReturnType<typeof createFlowClientCore>
): Promise<number> {
  const chainId = await flowClient.getChainId()
  const normalizedNetwork = getFlowNetwork(chainId)
  const flowEvmChainId = FLOW_EVM_CHAIN_IDS[normalizedNetwork]

  if (!flowEvmChainId) {
    throw new Error(
      `Unsupported Flow network: ${normalizedNetwork}. ` +
        `Supported networks: ${Object.keys(FLOW_EVM_CHAIN_IDS).join(", ")}`
    )
  }

  return flowEvmChainId
}
