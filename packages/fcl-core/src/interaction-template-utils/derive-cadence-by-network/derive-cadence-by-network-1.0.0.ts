import {invariant} from "@onflow/util-invariant"
import type {InteractionTemplate100} from "../interaction-template"

export interface DeriveCadenceByNetwork100Params {
  network: string
  template: InteractionTemplate100
}

/**
 * @description Fills import addresses in Cadence for network
 *
 * @param params
 * @param params.network Network to derive Cadence for
 * @param params.template Interaction Template to derive Cadence from
 * @returns Promise that resolves with the derived Cadence code
 */
export async function deriveCadenceByNetwork100({
  network,
  template,
}: DeriveCadenceByNetwork100Params): Promise<string> {
  invariant(
    template.f_version === "1.0.0",
    "deriveCadenceByNetwork100({ template }) -- template must be version 1.0.0"
  )

  const networkDependencies: [string, string][] = Object.keys(
    template?.data?.dependencies
  ).map((dependencyPlaceholder: string): [string, string] => {
    const dependencyNetworkContracts = Object.values(
      template?.data?.dependencies?.[dependencyPlaceholder]
    )

    invariant(
      dependencyNetworkContracts !== undefined,
      `deriveCadenceByNetwork100 -- Could not find contracts for dependency placeholder: ${dependencyPlaceholder}`
    )

    invariant(
      dependencyNetworkContracts.length > 0,
      `deriveCadenceByNetwork100 -- Could not find contracts for dependency placeholder: ${dependencyPlaceholder}`
    )

    const dependencyContract = dependencyNetworkContracts[0]
    const dependencyContractForNetwork = dependencyContract?.[network]

    invariant(
      dependencyContractForNetwork as any,
      `deriveCadenceByNetwork100 -- Could not find ${network} network information for dependency: ${dependencyPlaceholder}`
    )

    return [dependencyPlaceholder, dependencyContractForNetwork?.address]
  })

  return networkDependencies.reduce(
    (cadence: string, [placeholder, address]: [string, string]) => {
      const regex = new RegExp("(\\b" + placeholder + "\\b)", "g")
      return cadence.replace(regex, address)
    },
    template.data.cadence
  )
}
