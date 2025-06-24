import {block, invariant} from "@onflow/sdk"
import {generateDependencyPin110} from "./generate-dependency-pin-1.1.0"
import {generateDependencyPin100} from "./generate-dependency-pin-1.0.0"

export interface GenerateDependencyPinParams {
  version?: string
  address: string
  contractName: string
  blockHeight?: number
}

/**
 * @description Generates a dependency pin for a smart contract on the Flow blockchain. A dependency
 * pin is a cryptographic hash that uniquely identifies a specific version of a contract at a particular
 * state. This is used in Interaction Templates to ensure consistent behavior by pinning to specific
 * contract versions and preventing issues from contract updates.
 *
 * @param params
 * @param params.version The version of the interaction template (e.g., "1.0.0", "1.1.0")
 * @param params.address The Flow account address containing the contract (with or without 0x prefix)
 * @param params.contractName The name of the contract to generate a pin for
 * @param params.blockHeight Optional specific block height to pin to
 * @param opts Additional options to pass to the underlying interaction
 *
 * @returns Promise that resolves to the dependency pin as a string
 *
 * @throws If required parameters are missing or invalid, or if the template version is unsupported
 *
 * @example
 * // Generate dependency pin for a contract at current state
 * import * as fcl from "@onflow/fcl"
 *
 * const dependencyPin = await fcl.InteractionTemplateUtils.generateDependencyPin({
 *   version: "1.1.0",
 *   address: "0x1654653399040a61",
 *   contractName: "FlowToken"
 * })
 */
export async function generateDependencyPin(
  {version, address, contractName}: GenerateDependencyPinParams,
  opts: any = {}
): Promise<string> {
  invariant(
    address != undefined,
    "generateDependencyPin({ address }) -- address must be defined"
  )
  invariant(
    contractName != undefined,
    "generateDependencyPin({ contractName }) -- contractName must be defined"
  )
  invariant(
    typeof address === "string",
    "generateDependencyPin({ address }) -- address must be a string"
  )
  invariant(
    typeof contractName === "string",
    "generateDependencyPin({ contractName }) -- contractName must be a string"
  )

  switch (version) {
    case "1.1.0":
      return await generateDependencyPin110({address, contractName})
    case "1.0.0":
      return await generateDependencyPin100({address, contractName})
    default:
      throw new Error(
        "deriveCadenceByNetwork Error: Unsupported template version"
      )
  }
}

/**
 * @description Generates a dependency pin for a smart contract at the latest sealed block on the Flow
 * blockchain. This variant ensures the pin is generated against the most recent finalized state of the
 * network, providing consistency and avoiding issues with pending transactions affecting the pin generation.
 *
 * @param params
 * @param params.version The version of the interaction template (e.g., "1.0.0", "1.1.0")
 * @param params.address The Flow account address containing the contract (with or without 0x prefix)
 * @param params.contractName The name of the contract to generate a pin for
 * @param params.blockHeight This parameter is ignored as the function always uses latest sealed block
 * @param opts Additional options to pass to the underlying interaction
 *
 * @returns Promise that resolves to the dependency pin as a string
 *
 * @throws If required parameters are missing or invalid, template version is unsupported,
 * or if unable to fetch the latest sealed block
 *
 * @example
 * // Generate dependency pin at latest sealed block
 * import * as fcl from "@onflow/fcl"
 *
 * const dependencyPin = await fcl.InteractionTemplateUtils.generateDependencyPinAtLatestSealedBlock({
 *   version: "1.1.0",
 *   address: "0x1654653399040a61",
 *   contractName: "FlowToken"
 * })
 */
export async function generateDependencyPinAtLatestSealedBlock(
  {version, address, contractName}: GenerateDependencyPinParams,
  opts: any = {}
): Promise<string> {
  const latestSealedBlock = await block({sealed: true}, opts)
  const latestSealedBlockHeight = latestSealedBlock?.height

  return generateDependencyPin(
    {version, address, contractName, blockHeight: latestSealedBlockHeight},
    opts
  )
}
