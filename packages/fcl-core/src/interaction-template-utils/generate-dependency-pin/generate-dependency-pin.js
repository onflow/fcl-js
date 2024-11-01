import {block, invariant} from "@onflow/sdk"
import {generateDependencyPin110} from "./generate-dependency-pin-1.1.0.js"
import {generateDependencyPin100} from "./generate-dependency-pin-1.0.0.js"

/**
 * @description Produces a dependency pin for a contract at current state of chain
 * @param {object} params
 * @param {string} params.version - The version of the interaction template
 * @param {string} params.address - The address of the account containing the contract
 * @param {string} params.contractName - The name of the contract
 * @param {object} opts - Options to pass to the interaction
 * @returns {Promise<string>} - The dependency pin
 */
export async function generateDependencyPin(
  {version, address, contractName},
  opts = {}
) {
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
 * @description Produces a dependency pin for a contract at latest sealed block
 * @param {object} params
 * @param {string} params.version - The version of the interaction template
 * @param {string} params.address - The address of the account containing the contract
 * @param {string} params.contractName - The name of the contract
 * @param {object} opts - Options to pass to the interaction
 * @returns {Promise<string>} - The dependency pin
 */
export async function generateDependencyPinAtLatestSealedBlock(
  {version, address, contractName},
  opts = {}
) {
  const latestSealedBlock = await block({sealed: true}, opts)
  const latestSealedBlockHeight = latestSealedBlock?.height

  return generateDependencyPin(
    {version, address, contractName, blockHeight: latestSealedBlockHeight},
    opts
  )
}
