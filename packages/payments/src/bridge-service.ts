/**
 * Bridge service - converts between Cadence vault identifiers and EVM addresses
 * using the Flow EVM Bridge registry
 */

import type {createFlowClient} from "@onflow/fcl"
import type {Network} from "./constants"

/** Contract addresses for Flow EVM Bridge */
const BRIDGE_ADDRESSES = {
  testnet: {
    EVM: "0x8c5303eaa26202d6",
    FlowEVMBridgeConfig: "0xdfc20aee650fcbdf",
    FlowEVMBridgeUtils: "0xdfc20aee650fcbdf",
  },
  mainnet: {
    EVM: "0xe467b9dd11fa00df",
    FlowEVMBridgeConfig: "0x1e4aa0b87d10b141",
    FlowEVMBridgeUtils: "0x1e4aa0b87d10b141",
  },
  local: {
    EVM: "0xf8d6e0586b0a20c7",
    FlowEVMBridgeConfig: "0xf8d6e0586b0a20c7",
    FlowEVMBridgeUtils: "0xf8d6e0586b0a20c7",
  },
} as const

// Cadence script to get EVM address from vault type
const GET_EVM_ADDRESS_SCRIPT = (network: Network) => `
import EVM from ${BRIDGE_ADDRESSES[network].EVM}
import FlowEVMBridgeConfig from ${BRIDGE_ADDRESSES[network].FlowEVMBridgeConfig}

access(all) fun main(vaultIdentifier: String): String? {
    let vaultType = CompositeType(vaultIdentifier)
        ?? panic("Could not construct type from identifier: ".concat(vaultIdentifier))
    
    if let evmAddress = FlowEVMBridgeConfig.getEVMAddressAssociated(with: vaultType) {
        return evmAddress.toString()
    }
    
    return nil
}
`

// Cadence script to get vault type from EVM address
const GET_VAULT_TYPE_SCRIPT = (network: Network) => `
import EVM from ${BRIDGE_ADDRESSES[network].EVM}
import FlowEVMBridgeConfig from ${BRIDGE_ADDRESSES[network].FlowEVMBridgeConfig}

access(all) fun main(evmAddressHex: String): String? {
    let evmAddress = EVM.addressFromString(evmAddressHex)
    
    if let vaultType = FlowEVMBridgeConfig.getTypeAssociated(with: evmAddress) {
        return vaultType.identifier
    }
    
    return nil
}
`

// Cadence script to get token decimals from EVM address
const GET_TOKEN_DECIMALS_SCRIPT = (network: Network) => `
import EVM from ${BRIDGE_ADDRESSES[network].EVM}
import FlowEVMBridgeUtils from ${BRIDGE_ADDRESSES[network].FlowEVMBridgeUtils}

access(all) fun main(evmAddressHex: String): UInt8 {
    let evmAddress = EVM.addressFromString(evmAddressHex)
    return FlowEVMBridgeUtils.getTokenDecimals(evmContractAddress: evmAddress)
}
`

/**
 * Query the bridge to get the EVM address for a Cadence vault identifier
 * @param flowClient - Flow client (FCL or SDK)
 * @param vaultIdentifier - Cadence vault type identifier (e.g., "A.1654653399040a61.FlowToken.Vault")
 * @param network - Flow network (testnet or mainnet)
 * @returns EVM address or null if not bridged
 */
export async function getEvmAddressFromVaultType(
  flowClient: ReturnType<typeof createFlowClient>,
  vaultIdentifier: string,
  network: Network
): Promise<string | null> {
  try {
    const result = await flowClient.query({
      cadence: GET_EVM_ADDRESS_SCRIPT(network),
      args: (arg: any, t: any) => [arg(vaultIdentifier, t.String)],
    })
    return result || null
  } catch (error) {
    // If query fails, the type might not be bridged
    return null
  }
}

/**
 * Query the bridge to get the Cadence vault type for an EVM address
 * @param flowClient - Flow client (FCL or SDK)
 * @param evmAddress - EVM contract address (e.g., "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")
 * @param network - Flow network (testnet or mainnet)
 * @returns Cadence vault type identifier or null if not bridged
 */
export async function getVaultTypeFromEvmAddress(
  flowClient: ReturnType<typeof createFlowClient>,
  evmAddress: string,
  network: Network
): Promise<string | null> {
  try {
    const result = await flowClient.query({
      cadence: GET_VAULT_TYPE_SCRIPT(network),
      args: (arg: any, t: any) => [arg(evmAddress, t.String)],
    })
    return result || null
  } catch (error) {
    // If query fails, the address might not be bridged
    return null
  }
}

/**
 * Query the bridge to get the token decimals for an EVM address
 * @param flowClient - Flow client (FCL or SDK)
 * @param evmAddress - EVM contract address (e.g., "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")
 * @param network - Flow network (testnet, mainnet, or local)
 * @returns Token decimals (e.g., 6 for USDC, 18 for most tokens)
 */
export async function getTokenDecimals(
  flowClient: ReturnType<typeof createFlowClient>,
  evmAddress: string,
  network: Network
): Promise<number> {
  try {
    const result = await flowClient.query({
      cadence: GET_TOKEN_DECIMALS_SCRIPT(network),
      args: (arg: any, t: any) => [arg(evmAddress, t.String)],
    })
    return Number(result)
  } catch (error) {
    throw new Error(
      `Failed to get decimals for EVM address "${evmAddress}": ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}
