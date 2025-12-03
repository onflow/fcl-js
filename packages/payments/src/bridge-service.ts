/**
 * Bridge service - converts between Cadence vault identifiers and EVM addresses
 * using the Flow EVM Bridge registry
 */

import type {createFlowClient} from "@onflow/fcl"
import {getContracts} from "@onflow/config"
import flowJSON from "../flow.json"

import GET_EVM_ADDRESS_SCRIPT from "./cadence/get-evm-address-from-vault.cdc"
import GET_VAULT_TYPE_SCRIPT from "./cadence/get-vault-type-from-evm.cdc"
import GET_TOKEN_DECIMALS_SCRIPT from "./cadence/get-token-decimals.cdc"

type FlowNetwork = "emulator" | "testnet" | "mainnet"

/** Resolve `import "ContractName"` syntax using our bundled flow.json */
function resolveCadence(cadence: string, network: FlowNetwork): string {
  const contracts = getContracts(flowJSON, network)
  return cadence.replace(/import\s+"(\w+)"/g, (match, name) =>
    contracts[name] ? `import ${name} from 0x${contracts[name]}` : match
  )
}

/**
 * Query the bridge to get the EVM address for a Cadence vault identifier
 */
export async function getEvmAddressFromVaultType(
  flowClient: ReturnType<typeof createFlowClient>,
  vaultIdentifier: string,
  network: FlowNetwork
): Promise<string | null> {
  const result = await flowClient.query({
    cadence: resolveCadence(GET_EVM_ADDRESS_SCRIPT, network),
    args: (arg: any, t: any) => [arg(vaultIdentifier, t.String)],
  })
  return result || null
}

/**
 * Query the bridge to get the Cadence vault type for an EVM address
 */
export async function getVaultTypeFromEvmAddress(
  flowClient: ReturnType<typeof createFlowClient>,
  evmAddress: string,
  network: FlowNetwork
): Promise<string | null> {
  const result = await flowClient.query({
    cadence: resolveCadence(GET_VAULT_TYPE_SCRIPT, network),
    args: (arg: any, t: any) => [arg(evmAddress, t.String)],
  })
  return result || null
}

/**
 * Query the bridge to get the token decimals for an EVM address
 */
export async function getTokenDecimals(
  flowClient: ReturnType<typeof createFlowClient>,
  evmAddress: string,
  network: FlowNetwork
): Promise<number> {
  const result = await flowClient.query({
    cadence: resolveCadence(GET_TOKEN_DECIMALS_SCRIPT, network),
    args: (arg: any, t: any) => [arg(evmAddress, t.String)],
  })
  return Number(result)
}
