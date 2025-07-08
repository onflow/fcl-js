import {invariant, send, getAccount, config, decode} from "@onflow/sdk"
import {genHash} from "../utils/hash"
import {findImports} from "../utils/find-imports"
import {generateImport} from "../utils/generate-import"

export interface GenerateDependencyPin100Params {
  address: string
  contractName: string
}

/**
 * @description Produces a dependency pin for a contract at current state of chain
 * @param params
 * @param params.address The address of the account containing the contract
 * @param params.contractName The name of the contract
 * @param opts Options to pass to the interaction
 * @returns The dependency pin
 */
export async function generateDependencyPin100(
  {address, contractName}: GenerateDependencyPin100Params,
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

  const horizon: any = [generateImport({contractName, address})]

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

  const contractHashes = horizon.map((iport: any) => genHash(iport.contract))

  const contractHashesJoined = contractHashes.join("")

  return genHash(contractHashesJoined)
}
