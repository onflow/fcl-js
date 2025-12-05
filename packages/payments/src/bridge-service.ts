/**
 * Bridge service - converts between Cadence vault identifiers and EVM addresses
 * using the Flow EVM Bridge registry
 */

import type {createFlowClientCore} from "@onflow/fcl-core"
import {getContracts} from "@onflow/config"
import flowJSON from "../flow.json"
import type {FlowNetwork} from "./constants"

import GET_EVM_ADDRESS_SCRIPT from "../cadence/scripts/get-evm-address-from-vault.cdc"
import GET_VAULT_TYPE_SCRIPT from "../cadence/scripts/get-vault-type-from-evm.cdc"
import GET_TOKEN_DECIMALS_SCRIPT from "../cadence/scripts/get-token-decimals.cdc"

interface BridgeQueryOptions {
  flowClient: ReturnType<typeof createFlowClientCore>
}

/** Resolve `import "ContractName"` syntax using our bundled flow.json */
async function resolveCadence(
  flowClient: ReturnType<typeof createFlowClientCore>,
  cadence: string
): Promise<string> {
  const chainId = (await flowClient.getChainId()) as FlowNetwork
  const network = chainId === "local" ? "emulator" : chainId

  const contracts = getContracts(flowJSON, network)
  return cadence.replace(/import\s+"(\w+)"/g, (match, name) =>
    contracts[name] ? `import ${name} from 0x${contracts[name]}` : match
  )
}

/**
 * Query the bridge to get the EVM address for a Cadence vault identifier
 */
export async function getEvmAddressFromVaultType({
  flowClient,
  vaultIdentifier,
}: BridgeQueryOptions & {vaultIdentifier: string}): Promise<string | null> {
  const result = await flowClient.query({
    cadence: await resolveCadence(flowClient, GET_EVM_ADDRESS_SCRIPT),
    args: (arg: any, t: any) => [arg(vaultIdentifier, t.String)],
  })
  return result || null
}

/**
 * Query the bridge to get the Cadence vault type for an EVM address
 */
export async function getVaultTypeFromEvmAddress({
  flowClient,
  evmAddress,
}: BridgeQueryOptions & {evmAddress: string}): Promise<string | null> {
  const result = await flowClient.query({
    cadence: await resolveCadence(flowClient, GET_VAULT_TYPE_SCRIPT),
    args: (arg: any, t: any) => [arg(evmAddress, t.String)],
  })
  return result || null
}

/**
 * Query the bridge to get the token decimals for an EVM address
 */
export async function getTokenDecimals({
  flowClient,
  evmAddress,
}: BridgeQueryOptions & {evmAddress: string}): Promise<number> {
  const result = await flowClient.query({
    cadence: await resolveCadence(flowClient, GET_TOKEN_DECIMALS_SCRIPT),
    args: (arg: any, t: any) => [arg(evmAddress, t.String)],
  })
  return Number(result)
}
