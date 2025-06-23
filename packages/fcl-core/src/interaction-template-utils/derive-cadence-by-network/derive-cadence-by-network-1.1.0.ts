import {invariant} from "@onflow/util-invariant"
import {replaceStringImports} from "../utils/replace-string-imports"
import type {InteractionTemplate110} from "../interaction-template"

export interface DeriveCadenceByNetwork110Params {
  network: string
  template: InteractionTemplate110
}

/**
 * @description Fills import addresses in Cadence for network
 *
 * @param {DeriveCadenceByNetwork110Params} params
 * @param {string} params.network Network to derive Cadence for
 * @param {InteractionTemplate110} params.template Interaction Template to derive Cadence from
 * @returns {Promise<string>} Promise that resolves with the derived Cadence code
 */
export async function deriveCadenceByNetwork110({
  network,
  template,
}: DeriveCadenceByNetwork110Params): Promise<string> {
  invariant(
    template.f_version === "1.1.0",
    "deriveCadenceByNetwork110({ template }) -- template must be version 1.1.0"
  )

  // get network dependencies from template dependencies, use new string import format
  const networkDependencies: Record<string, string> = {}

  template?.data?.dependencies.forEach(dependency => {
    dependency.contracts.forEach(contract => {
      const contractName = contract.contract
      contract.networks.forEach(net => {
        if (net.network === network) {
          networkDependencies[contractName] = net.address
        }
      })

      invariant(
        networkDependencies[contractName] !== undefined,
        `deriveCadenceByNetwork110 -- Could not find contracts Network Address: ${network} ${contractName}`
      )
    })
  })

  invariant(
    Object.keys(networkDependencies).length ===
      template?.data?.dependencies.length,
    `deriveCadenceByNetwork110 -- Could not find contracts for import dependencies: ${networkDependencies}`
  )

  invariant(
    Object.keys(networkDependencies).length ===
      Object.values(networkDependencies).length,
    `deriveCadenceByNetwork110 -- Could not find all addresses for network ${network} dependencies:  ${networkDependencies}`
  )

  invariant(
    !!template?.data?.cadence?.body,
    `no cadence found -- Could not replace import dependencies: ${networkDependencies}`
  )

  return replaceStringImports({
    cadence: template?.data?.cadence?.body,
    networkDependencies,
  })
}
