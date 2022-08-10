import {invariant} from "@onflow/sdk"
import {normalizeInteractionTemplate} from "./normalize/interaction-template"

export function deriveCadenceByNetwork({network, template}) {
  invariant(
    network != undefined,
    "deriveCadenceByNetwork({ network }) -- network must be defined"
  )
  invariant(
    typeof network === "string",
    "deriveCadenceByNetwork({ network }) -- network must be a string"
  )

  invariant(
    template != undefined,
    "generateDependencyPin({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "generateDependencyPin({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "generateDependencyPin({ template }) -- template must be an InteractionTemplate"
  )

  template = normalizeInteractionTemplate(template)

  switch (template.f_version) {
    case "1.0.0":
      let networkDependencies = Object.keys(template?.data?.dependencies).map(
        dependencyPlaceholder => {
          let dependencyNetworkContracts = Object.values(
            template?.data?.dependencies?.[dependencyPlaceholder]
          )

          invariant(
            dependencyNetworkContracts,
            `deriveCadenceByNetwork -- Could not find contracts for dependency placeholder: ${dependencyPlaceholder}`
          )

          invariant(
            dependencyNetworkContracts.length === 0,
            `deriveCadenceByNetwork -- Could not find contracts for dependency placeholder: ${dependencyPlaceholder}`
          )

          let dependencyContract = dependencyNetworkContracts[0]
          let dependencyContractForNetwork = dependencyContract?.[network]

          invariant(
            dependencyContractForNetwork,
            `deriveCadenceByNetwork -- Could not find ${network} network information for dependency: ${dependencyPlaceholder}`
          )

          return [dependencyPlaceholder, dependencyContractForNetwork.address]
        }
      )

      return networkDependencies.reduce((cadence, [placeholder, address]) => {
        const regex = new RegExp("(\\b" + placeholder + "\\b)", "g")
        return cadence.replace(regex, address)
      }, template.data.cadence)

    default:
      throw new Error(
        "deriveCadenceByNetwork Error: Unsupported template version"
      )
  }
}
