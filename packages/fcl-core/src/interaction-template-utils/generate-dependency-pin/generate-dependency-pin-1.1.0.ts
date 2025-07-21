import {invariant, getAccount} from "@onflow/sdk"
import {genHash} from "../utils/hash"
import {findImports} from "../utils/find-imports"
import {generateImport} from "../utils/generate-import"
import {FCLContext} from "../../context"
import {createPartialGlobalFCLContext} from "../../context/global"

export interface GenerateDependencyPin110Params {
  address: string
  contractName: string
  blockHeight?: number
}

export function createGenerateDependencyPin110(
  context: Pick<FCLContext, "config" | "sdk">
) {
  /**
   * @description Produces a dependency pin for a contract at current state of chain
   * @param params
   * @param params.address The address of the account containing the contract
   * @param params.contractName The name of the contract
   * @param params.blockHeight The block height to generate the dependency pin at
   * @param opts Options to pass to the interaction
   * @returns The dependency pin
   */
  async function generateDependencyPin110(
    {address, contractName}: GenerateDependencyPin110Params,
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
      const account = await context.sdk
        .send(
          [
            getAccount(
              await context.config.get(
                horizonImport.address,
                horizonImport.address
              )
            ),
          ],
          opts
        )
        .then(context.sdk.decode)

      horizonImport.contract = account.contracts?.[horizonImport.contractName]

      if (!horizonImport.contract) {
        console.error("Did not find expected contract", horizonImport, account)
        throw new Error("Did not find expected contract")
      }

      const contractImports = findImports(horizonImport.contract)

      horizon.push(...contractImports)
    }

    const contractPinSelfHashesPromises = horizon.map((iport: any) =>
      genHash(iport.contract)
    )
    // genHash returns a promise, so we need to await the results of all the promises
    const contractPinSelfHashes = await Promise.all(
      contractPinSelfHashesPromises
    )
    const contractPinHashes = contractPinSelfHashes.join("")

    return genHash(contractPinHashes)
  }

  return generateDependencyPin110
}

export const generateDependencyPin110 =
  /* @__PURE__ */ createGenerateDependencyPin110(
    createPartialGlobalFCLContext()
  )
