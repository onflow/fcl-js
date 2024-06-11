import {invariant} from "@onflow/util-invariant"

/**
 * @description Fills import addresses in Cadence for network
 *
 * @param {object} params
 * @param {string} params.network - Network to derive Cadence for
 * @param {object} params.template - Interaction Template to derive Cadence from
 * @returns {Promise<string>} - Promise that resolves with the derived Cadence code
 */
export async function deriveCadenceByNetwork100({network, template}) {
  invariant(
    template.f_version === "1.0.0",
    "deriveCadenceByNetwork100({ template }) -- template must be version 1.0.0"
  )

  const networkDependencies = Object.keys(template?.data?.dependencies).map(
    dependencyPlaceholder => {
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
        dependencyContractForNetwork,
        `deriveCadenceByNetwork100 -- Could not find ${network} network information for dependency: ${dependencyPlaceholder}`
      )

      return [dependencyPlaceholder, dependencyContractForNetwork?.address]
    }
  )

  return networkDependencies.reduce((cadence, [placeholder, address]) => {
    const regex = new RegExp("(\\b" + placeholder + "\\b)", "g")
    return cadence.replace(regex, address)
  }, template.data.cadence)
}
