import {
  invariant,
  block,
  send,
  getAccount,
  atBlockHeight,
  config,
  decode,
} from "@onflow/sdk"
import {genHash} from "./utils/hash.js"
import {findImports} from "./utils/find-imports.js"
import {generateImport} from "./utils/generate-import.js"

/**
 * @description Produces a dependency pin for a contract at a given block height
 * @param {Object} params
 * @param {string} params.address - The address of the account containing the contract
 * @param {string} params.contractName - The name of the contract
 * @param {number} params.blockHeight - The block height to produce the dependency pin for
 * @returns {Promise<string>} - The dependency pin
 */
export async function generateDependencyPin(
  {address, contractName, blockHeight},
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
    blockHeight != undefined,
    "generateDependencyPin({ blockHeight }) -- blockHeight must be defined"
  )
  invariant(
    typeof address === "string",
    "generateDependencyPin({ address }) -- address must be a string"
  )
  invariant(
    typeof contractName === "string",
    "generateDependencyPin({ contractName }) -- contractName must be a string"
  )
  invariant(
    typeof blockHeight === "number",
    "generateDependencyPin({ blockHeight }) -- blockHeight must be a number"
  )

  let horizon = [generateImport({contractName, address})]

  for (const horizonImport of horizon) {
    let account = await send(
      [
        getAccount(
          await config().get(horizonImport.address, horizonImport.address)
        ),
        atBlockHeight(blockHeight),
      ],
      opts
    ).then(decode)

    horizonImport.contract = account.contracts?.[horizonImport.contractName]

    if (!horizonImport.contract) {
      console.error("Did not find expected contract", horizonImport, account)
      throw new Error("Did not find expected contract")
    }

    let contractImports = findImports(horizonImport.contract)

    horizon.push(...contractImports)
  }

  let contractHashes = horizon.map(iport => genHash(iport.contract))

  let contractHashesJoined = contractHashes.join("")

  return genHash(contractHashesJoined)
}

/**
 * @description Produces a dependency pin for a contract at latest sealed block
 */
export async function generateDependencyPinAtLatestSealedBlock(
  {address, contractName},
  opts = {}
) {
  let latestSealedBlock = await block({sealed: true}, opts)
  let latestSealedBlockHeight = latestSealedBlock?.height

  return generateDependencyPin(
    {address, contractName, blockHeight: latestSealedBlockHeight},
    opts
  )
}
