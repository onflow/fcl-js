import {generateDependencyPin} from "./generate-dependency-pin.js"
import {invariant, block} from "@onflow/sdk"
import {log, LEVELS} from "@onflow/util-logger"
import {normalizeInteractionTemplate} from "../normalizers/interaction-template/interaction-template.js"

/**
 * @description Checks if an Interaction Template's pins match
 * 
 * @param {Object} params
 * @param {Object} params.template - Interaction Template to check pins for
 * @param {number} params.blockHeight - Block height to check pins at
 * @param {string} params.network - Network to check pins on
 * @param {Object} opts
 * @returns {Promise<boolean>} - Whether or not the pins match
 */
export async function verifyDependencyPinsSame(
  {template, blockHeight, network},
  opts = {}
) {
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

  invariant(
    network != undefined,
    "generateDependencyPin({ network }) network must be defined"
  )
  invariant(
    blockHeight != undefined,
    "generateDependencyPin({ blockHeight }) blockHeight must be defined"
  )
  invariant(
    typeof blockHeight === "number",
    "generateDependencyPin({ blockHeight }) blockHeight must be a number"
  )

  switch (template.f_version) {
    case "1.0.0":
      let templateDependenciesPlaceholderKeys = Object.keys(
        template.data.dependencies
      )

      for (let templateDependencyPlaceholderKey of templateDependenciesPlaceholderKeys) {
        let templateDependencyPlaceholder =
          template.data.dependencies[templateDependencyPlaceholderKey]

        let templateDependencyPlaceholderContractNames = Object.keys(
          templateDependencyPlaceholder
        )

        for (let templateDependencyPlaceholderContractName of templateDependencyPlaceholderContractNames) {
          let templateDependencyPlaceholderContractNetworks =
            template.data.dependencies[templateDependencyPlaceholderKey][
              templateDependencyPlaceholderContractName
            ]

          let templateDependency =
            templateDependencyPlaceholderContractNetworks[network]
          if (typeof templateDependency === "undefined") continue

          let pin = await generateDependencyPin(
            {
              address: templateDependency.address,
              contractName: templateDependency.contract,
              blockHeight,
            },
            opts
          )

          if (pin !== templateDependency.pin) {
            log({
              title: "verifyDependencyPinsSame Debug Error",
              message: `Could not recompute and match dependency pin.
                                address: ${templateDependency.address} | contract: ${templateDependency.contract}
                                computed: ${pin}
                                template: ${templateDependency.pin}
                            `,
              level: LEVELS.debug,
            })
            return false
          }
        }
      }

      return true

    default:
      throw new Error(
        "verifyDependencyPinsSame Error: Unsupported template version"
      )
  }
}

/**
 * @description Checks if an Interaction Template's pins match at latest block
 * 
 * @param {Object} params
 * @param {Object} params.template - Interaction Template to check pins for
 * @param {string} params.network - Network to check pins on
 * @param {Object} opts
 * @returns {Promise<boolean>} - Whether or not the pins match
 */
export async function verifyDependencyPinsSameAtLatestSealedBlock(
  {template, network},
  opts = {}
) {
  let latestSealedBlock = await block({sealed: true})
  let latestSealedBlockHeight = latestSealedBlock?.height

  return verifyDependencyPinsSame(
    {template, network, blockHeight: latestSealedBlockHeight},
    opts
  )
}
