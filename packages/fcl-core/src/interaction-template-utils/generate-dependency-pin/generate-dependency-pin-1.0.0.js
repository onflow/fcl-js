import {invariant, send, getAccount, config, decode} from "@onflow/sdk"
import {genHash} from "../utils/hash.js"
import {findImports} from "../utils/find-imports.js"
import {generateImport} from "../utils/generate-import.js"

/**
 * @description Produces a dependency pin for a contract at current state of chain
 * @param {object} params
 * @param {string} params.address - The address of the account containing the contract
 * @param {string} params.contractName - The name of the contract
 * @param {object} opts - Options to pass to the interaction
 * @returns {Promise<string>} - The dependency pin
 */
export async function generateDependencyPin100(
  {address, contractName},
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

  const horizon = [generateImport({contractName, address})]

  for (const horizonImport of horizon) {
    const account = await send(
      [
        getAccount(
          await config().get(horizonImport.address, horizonImport.address)
        ),
      ],
      opts
    ).then(decode)

    horizonImport.contract = account.contracts?.[horizonImport.contractName]

    if (!horizonImport.contract) {
      console.error("Did not find expected contract", horizonImport, account)
      throw new Error("Did not find expected contract")
    }

    const contractImports = findImports(horizonImport.contract)

    horizon.push(...contractImports)
  }

  const contractHashes = horizon.map(iport => genHash(iport.contract))

  const contractHashesJoined = contractHashes.join("")

  return genHash(contractHashesJoined)
}
