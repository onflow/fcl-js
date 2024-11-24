import {generateDependencyPin} from "./generate-dependency-pin/generate-dependency-pin.js"
import {invariant, block} from "@onflow/sdk"
import {log, LEVELS} from "@onflow/util-logger"

/**
 * @description Checks if an Interaction Template's pins match those generated at a block height
 *
 * @param {object} params
 * @param {object} params.template - Interaction Template to check pins for
 * @param {number} params.blockHeight - Block height to check pins at
 * @param {string} params.network - Network to check pins on
 * @param {object} opts
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
      const templateDependenciesPlaceholderKeys = Object.keys(
        template.data.dependencies
      )

      for (let templateDependencyPlaceholderKey of templateDependenciesPlaceholderKeys) {
        const templateDependencyPlaceholder =
          template.data.dependencies[templateDependencyPlaceholderKey]

        const templateDependencyPlaceholderContractNames = Object.keys(
          templateDependencyPlaceholder
        )

        for (let templateDependencyPlaceholderContractName of templateDependencyPlaceholderContractNames) {
          const templateDependencyPlaceholderContractNetworks =
            template.data.dependencies[templateDependencyPlaceholderKey][
              templateDependencyPlaceholderContractName
            ]

          const templateDependency =
            templateDependencyPlaceholderContractNetworks[network]
          if (typeof templateDependency === "undefined") continue

          const pin = await generateDependencyPin(
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

    case "1.1.0":
      let isVerified = false
      // iterate over each dependency
      for (let i = 0; i < template.data?.dependencies.length; i++) {
        const dependency = template.data?.dependencies[i]
        // iterate over each contract in dependency
        for (let j = 0; j < dependency?.contracts.length; j++) {
          const contract = dependency?.contracts[j]
          // iterate over each network in contract
          for (let k = 0; k < contract?.networks.length; k++) {
            const net = contract?.networks[k]
            // if network matches, generate pin and compare
            if (net.network === network) {
              const pin = await generateDependencyPin(
                {
                  version: template.f_version,
                  address: net.address,
                  contractName: contract.contract,
                  blockHeight,
                },
                opts
              )

              if (pin !== net.dependency_pin.pin) {
                log({
                  title: "verifyDependencyPinsSame Debug Error",
                  message: `Could not recompute and match dependency pin.
                                    address: ${net.address} | contract: ${contract.contract}
                                    computed: ${pin}
                                    template: ${net.pin}
                                `,
                  level: LEVELS.debug,
                })
                return false
              } else {
                isVerified = true
              }
            }
          }
        }
      }
      return isVerified

    default:
      throw new Error(
        "verifyDependencyPinsSame Error: Unsupported template version"
      )
  }
}

/**
 * @description Checks if an Interaction Template's pins match those generated at the latest block height
 *
 * @param {object} params
 * @param {object} params.template - Interaction Template to check pins for
 * @param {string} params.network - Network to check pins on
 * @param {object} opts
 * @returns {Promise<boolean>} - Whether or not the pins match
 */
export async function verifyDependencyPinsSameAtLatestSealedBlock(
  {template, network},
  opts = {}
) {
  const latestSealedBlock = await block({sealed: true})
  const latestSealedBlockHeight = latestSealedBlock?.height

  return verifyDependencyPinsSame(
    {template, network, blockHeight: latestSealedBlockHeight},
    opts
  )
}
